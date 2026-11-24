# Task-state composition on mobile

When an activity carries the screen's identity (workout timer, audio/video recorder, delivery tracker, transit ride, focus session, voice memo), keep **one persistent task-bearing object** recognizable across **setup → active → complete** rather than swapping disconnected ornamental cards at each step.

## Stage progression around one task object

| Stage | Persistent object behavior | Controls & hierarchy |
|---|---|---|
| **Setup** | Preview the live subject (camera frame, configured duration, selected route, draft waveform) at primary scale. | Limit setup to the 1–3 choices required to start; tuck advanced parameters into a sheet. Put the primary Start control in the lower thumb zone. |
| **Active** | Keep the same object anchored and legible at a glance; numeric state (elapsed/remaining time, recording indicator, distance, upload progress) must stay readable without relying on animation or illustration. | Swap setup controls for in-flight actions only (Pause/Resume, Lap/Marker, Stop). Guard destructive Discard/Cancel behind a confirmation or hold/slide gesture. |
| **Complete** | Show the finished artifact or summary in the same visual anchor before secondary rewards. | Put the next meaningful action (Save, Share, Export, Start Next) first. Never trap the user behind a mandatory celebration modal, rating prompt, or upsell before reaching their result. |

For live-capture tools (camera, audio, scanner), keep active capture controls and recording status in one-handed reach during capture; reveal the full editing toolset only after capture completes.

## Persistent OS surfaces: Live Activities & Live Updates

Long-running tasks leave the foreground constantly. Mirror live state onto OS lock-screen and status surfaces instead of forcing users to unlock and reopen the app:

- **iOS Live Activities & Dynamic Island (`ActivityKit`)**: define `ActivityAttributes` (static metadata) and `ContentState` (dynamic state), update via `Activity.update(_:)` with an explicit `staleDate` so expired timers/ETAs visibly mark themselves stale rather than showing frozen lies, and end cleanly with `.immediate` or `.after(Date)` dismissal policy. Provide compact leading/trailing, minimal, expanded, and Lock Screen layouts with text equivalents for VoiceOver.

```swift
import ActivityKit

struct SessionAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    var endDate: Date
    var isPaused: Bool
  }
  var label: String
}

let content = ActivityContent(
  state: .init(endDate: targetEnd, isPaused: false),
  staleDate: targetEnd.addingTimeInterval(60)
)
let activity = try Activity.request(attributes: .init(label: "Focus"), content: content)
```

- **Android Foreground Service & Android 16 Live Updates**: run ongoing user-initiated work in a declared `foregroundServiceType` (`microphone`, `location`, `mediaPlayback`, `dataSync`, etc.) with a persistent notification carrying a Pause/Stop `PendingIntent`. On Android 16 (API 36+), use progress-centric **Live Updates** (`Notification.ProgressStyle` + `setRequestPromotedOngoing(true)` with `POST_PROMOTED_NOTIFICATIONS`) for time-bounded user-tracked journeys (rides, deliveries, timers) so progress stays visible on the lock screen and status chip.

```kotlin
val style = Notification.ProgressStyle()
  .setProgress(elapsedMinutes)
  .setProgressSegments(listOf(Notification.ProgressStyle.Segment(totalMinutes)))

val notification = Notification.Builder(context, CHANNEL_ACTIVE_TASK)
  .setSmallIcon(R.drawable.ic_timer)
  .setContentTitle("Focus session")
  .setOngoing(true)
  .setStyle(style)
  .build()
```

## Wake-lock & interruption resumption

Interruption (phone call, OS memory kill, screen lock, audio route change, switching apps) is normal mobile behavior—not an edge case:

- **Persist timestamps, not tick counters**: record monotonic or wall-clock start/pause checkpoints (`SystemClock.elapsedRealtime()` + persisted epoch) and draft media chunks to storage on every state transition. Recompute remaining time on resume so backgrounding or process death never drifts or resets progress.
- **Scope wake-locks tightly**: acquire `UIApplication.shared.isIdleTimerDisabled = true` (iOS) or `WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON` / timeout-bounded `PowerManager.WakeLock` (Android) only while active foreground monitoring requires it, and always release on pause, completion, or `onStop`.
- **Idempotent stop & save**: guard Stop/Complete handlers against double-taps, notification action + in-app button races, and background audio interruptions; auto-save partial recordings rather than discarding them on incoming calls.

## One-handed reach & ergonomics

- Anchor Start, Pause/Resume, and Stop inside the lower reachable third above the home indicator / gesture bar (`safeAreaInset` / `navigationBarsPadding`).
- Separate destructive actions (`Discard`) from primary actions (`Pause` / `Done`) by at least `8 pt/dp` or move `Discard` into a confirmation dialog / secondary corner.
- Keep touch targets ≥ `44×44 pt` (iOS) / `48×48 dp` (Android) even when a timer or waveform shrinks at `200%` text scaling.

## Do/don't pairs

| Do | Don't |
|---|---|
| Keep one recognizable task object anchored across setup, active, and complete stages | Replace the whole screen with unrelated decorative cards on every state change |
| Show textual + numeric state (`Recording 02:14`) alongside visual indicators | Rely solely on a pulsing red dot or animated waveform to signal active capture |
| Persist start checkpoints and draft buffers so process death resumes cleanly | Keep timer/recording state only in view-local `@State` / `remember` |
| Set `staleDate` on Live Activities and clear foreground notifications on finish | Leave orphaned "2 min left" Lock Screen widgets running hours after completion |
| Put Save/Share/Next ahead of badges or upsells on completion | Block access to the user's finished recording behind a celebratory paywall modal |

## Verification checks

Test on a real device or simulator (`rendered`; mark unavailable hardware checks `not-checked`—App Store/Play Store screenshots never verify interruption, focus, or motion):

1. Complete setup → active → pause → resume → complete **one-handed** on a tall phone at default and `200%` / AX3 text sizes (`rendered`).
2. Background the app, trigger a simulated phone call or process death, and return: verify elapsed time, draft file integrity, and Stop/Resume controls match reality (`rendered`).
3. Verify Live Activity / Dynamic Island (iOS) or Foreground Service / Live Update notification (Android) updates, responds to Stop/Pause actions, and dismisses cleanly on completion (`rendered`).
4. Verify Reduced Motion replaces continuous pulsing/scrolling illustrations with stable numeric/text status (`rendered`).
