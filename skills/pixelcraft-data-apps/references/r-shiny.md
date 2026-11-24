# R Shiny

Shiny for R belongs in the rapid data-app space with its own reactive idioms; do not force Python patterns onto R code.

## Token mapping and bslib layout

Use `bslib::bs_theme(version = 5, ...)` paired with `thematic::thematic_shiny()` so ggplot2/lattice/base plots automatically inherit UI colors and fonts. Build responsive shells with `page_sidebar()`, `page_navbar()`, `layout_columns()`, `card(full_screen = TRUE)`, `value_box()`, and `input_dark_mode()`.

## Modern R Shiny idioms (`bslib`, `ExtendedTask` + `mirai`, `bindCache`, `shinychat`/`ellmer`, modules)

```r
library(shiny)
library(bslib)
library(mirai)
library(shinychat)
library(ellmer)

# Start background worker daemons once per R process for non-blocking tasks
daemons(2)
onStop(function() daemons(0))

# Reusable namespaced module isolating per-instance state
kpi_module_ui <- function(id) {
  ns <- NS(id)
  card(
    full_screen = TRUE,
    card_header("Regional summary"),
    uiOutput(ns("summary_box"))
  )
}

kpi_module_server <- function(id, region_reactive) {
  moduleServer(id, function(input, output, session) {
    cached_summary <- reactive({
      req(region_reactive())
      query_region_summary(region_reactive())
    }) |> bindCache(region_reactive(), cache = "session")  # use "session" for user-private data

    output$summary_box <- renderUI({
      df <- cached_summary()
      validate(need(nrow(df) > 0, "No records match the selected region."))
      value_box(title = "Total revenue", value = scales::dollar(sum(df$revenue)))
    })
  })
}

ui <- page_sidebar(
  title = "Operations Console",
  theme = bs_theme(version = 5, primary = "#005f73", bg = "#faf8f1", fg = "#161b24"),
  sidebar = sidebar(
    selectInput("region", "Region", choices = c("EMEA", "AMER", "APAC")),
    input_task_button("run_sim", "Run Monte Carlo"),
    input_dark_mode(id = "mode")
  ),
  layout_columns(
    kpi_module_ui("kpi"),
    card(card_header("Simulation"), tableOutput("sim_tbl")),
    card(card_header("Analyst chat"), chat_ui("assistant"))
  )
)

server <- function(input, output, session) {
  kpi_module_server("kpi", reactive(input$region))

  # Non-blocking background computation across sessions via ExtendedTask + mirai
  sim_task <- ExtendedTask$new(function(region) {
    mirai({ run_heavy_simulation(r) }, r = region)
  }) |> bind_task_button("run_sim")

  observeEvent(input$run_sim, {
    sim_task$invoke(input$region)
  })

  output$sim_tbl <- renderTable({
    res <- sim_task$result()
    validate(need(nrow(res) > 0, "Simulation returned no rows."))
    res
  })

  # Streaming LLM assistant with shinychat + ellmer
  llm <- chat_openai(system_prompt = "Answer concise analytics questions.")
  observeEvent(input$assistant_user_input, {
    stream <- llm$stream_async(input$assistant_user_input)
    chat_append("assistant", stream)
  })
}

shinyApp(ui, server)
```

## Typography, motion, and accessibility

Set `base_font` and `heading_font` in `bs_theme()` (e.g., `font_google(...)` or locally hosted fonts for air-gapped deployments). Prefer `input_task_button` and `withProgress` over decorative motion, and honor `prefers-reduced-motion` in custom CSS. Provide labels for every input, use `validate(need(...))` so empty or invalid states display clear copy instead of blank containers, and add text/table alternatives alongside plots.

## States and forms idiom

- Choose `bindCache(..., cache = "session")` for tenant- or user-private queries; reserve `cache = "app"` strictly for public/shared data.
- Encapsulate reusable panels with `NS(id)` + `moduleServer(id, ...)` to prevent input/output ID collisions.
- Never run heavy blocking R computations directly inside `renderPlot`/`observeEvent` on shared workers—offload them via `ExtendedTask` + `mirai`.
- Preserve form inputs across reactive updates (`shinyvalidate::InputValidator` for inline field validation) and validate uploaded files (`fileInput`) by size and MIME/extension before parsing.

## Do/don't pairs

| Do | Don't |
|---|---|
| `ExtendedTask` + `mirai` + `bind_task_button()` for slow R jobs | Blocking the single R process for every connected user |
| `bindCache(..., cache = "session")` for private user queries | Sharing user-specific rows in `cache = "app"` |
| `NS(id)` + `moduleServer()` for repeated panels | Copy-pasting global input IDs like `region1`, `region2` |
| `validate(need(nrow(df) > 0, "..."))` explicit empty/error copy | Bare `req()` silently leaving a blank card |
| `bs_theme(version = 5, ...)` + `thematic_shiny()` + `input_dark_mode()` | Hardcoded ggplot light theme clashing with dark mode |

## Known traps

Cross-session leakage from global variables or `cache = "app"`, blocking workers without `ExtendedTask`/`mirai`, reactive invalidation loops, un-namespaced IDs inside modules, forgetting `daemons(0)` cleanup on stop, and plot themes ignoring `input_dark_mode()`.

## Verification commands

```sh
Rscript -e 'shiny::runApp()'
Rscript -e 'testthat::test_dir("tests")'
Rscript -e 'shinytest2::test_app()'
```

`testthat::test_dir("tests")` and `shiny::testServer()` verify reactive server logic (`static`/unit evidence); `shinytest2::test_app()` (requires `shinytest2` and Chromium) and interactive browser inspection across light/dark modes and narrow widths provide `rendered` evidence.
