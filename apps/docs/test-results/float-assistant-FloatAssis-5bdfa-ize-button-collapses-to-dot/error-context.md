# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: float-assistant.spec.ts >> FloatAssistant >> minimize button collapses to dot
- Location: tests/float-assistant.spec.ts:100:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[aria-label="Minimize assistant"]')
    - locator resolved to <button type="button" title="Minimize to corner" aria-label="Minimize assistant" class="rebar-float-assistant-minimize-btn">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <h1 data-rebar-level="1" class="rebar-heading" data-rebar-component="heading">FloatAssistant</h1> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <h1 data-rebar-level="1" class="rebar-heading" data-rebar-component="heading">FloatAssistant</h1> intercepts pointer events
    - retrying click action
      - waiting 100ms
    54 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <h1 data-rebar-level="1" class="rebar-heading" data-rebar-component="heading">FloatAssistant</h1> intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "Rebar UI" [ref=e5] [cursor=pointer]:
        - /url: /
      - navigation "Main" [ref=e13]:
        - link "For Agents" [ref=e15] [cursor=pointer]:
          - /url: /about/agent
        - button "Construct Library" [ref=e16] [cursor=pointer]:
          - text: Construct Library
          - generic [ref=e17]: ▾
        - button "Framework" [ref=e18] [cursor=pointer]:
          - text: Framework
          - generic [ref=e19]: ▾
      - combobox "Search constructs" [ref=e22]
      - generic [ref=e23]:
        - button "Theme" [ref=e25] [cursor=pointer]
        - paragraph [ref=e26]: 0.11.0
  - main [ref=e27]:
    - generic [ref=e28]:
      - navigation "Page index" [ref=e29]:
        - generic [ref=e30]:
          - searchbox "Search constructs…" [ref=e31]
          - button "Filter by category" [ref=e32] [cursor=pointer]:
            - generic [ref=e33]: All categories
        - list [ref=e37]:
          - listitem [ref=e38]:
            - link "All Opinions" [ref=e39] [cursor=pointer]:
              - /url: /opinions
        - list [ref=e41]:
          - listitem [ref=e42]:
            - link "Accordion" [ref=e43] [cursor=pointer]:
              - /url: /opinions/accordion
          - listitem [ref=e44]:
            - link "ActionSheet" [ref=e45] [cursor=pointer]:
              - /url: /opinions/action-sheet
          - listitem [ref=e46]:
            - link "Ai Chat" [ref=e47] [cursor=pointer]:
              - /url: /opinions/ai-chat
          - listitem [ref=e48]:
            - link "AreaChart" [ref=e49] [cursor=pointer]:
              - /url: /opinions/area-chart
          - listitem [ref=e50]:
            - link "BottomSheet" [ref=e51] [cursor=pointer]:
              - /url: /opinions/bottom-sheet
          - listitem [ref=e52]:
            - link "BoxPlot" [ref=e53] [cursor=pointer]:
              - /url: /opinions/box-plot
          - listitem [ref=e54]:
            - link "BubbleChart" [ref=e55] [cursor=pointer]:
              - /url: /opinions/bubble-chart
          - listitem [ref=e56]:
            - link "Calendar" [ref=e57] [cursor=pointer]:
              - /url: /opinions/calendar
          - listitem [ref=e58]:
            - link "CalendarHeatmap" [ref=e59] [cursor=pointer]:
              - /url: /opinions/calendar-heatmap
          - listitem [ref=e60]:
            - link "Card Kanban" [ref=e61] [cursor=pointer]:
              - /url: /opinions/card-kanban
          - listitem [ref=e62]:
            - link "Cascader" [ref=e63] [cursor=pointer]:
              - /url: /opinions/cascader
          - listitem [ref=e64]:
            - link "Collapsible" [ref=e65] [cursor=pointer]:
              - /url: /opinions/collapsible
          - listitem [ref=e66]:
            - link "ColorPicker" [ref=e67] [cursor=pointer]:
              - /url: /opinions/color-picker
          - listitem [ref=e68]:
            - link "Combobox" [ref=e69] [cursor=pointer]:
              - /url: /opinions/combobox
          - listitem [ref=e70]:
            - link "CommandPalette" [ref=e71] [cursor=pointer]:
              - /url: /opinions/command-palette
          - listitem [ref=e72]:
            - link "CommentThread" [ref=e73] [cursor=pointer]:
              - /url: /opinions/comment-thread
          - listitem [ref=e74]:
            - link "ConstructSearch" [ref=e75] [cursor=pointer]:
              - /url: /opinions/construct-search
          - listitem [ref=e76]:
            - link "ContextMenu" [ref=e77] [cursor=pointer]:
              - /url: /opinions/context-menu
          - listitem [ref=e78]:
            - link "DataGrid" [ref=e79] [cursor=pointer]:
              - /url: /opinions/data-grid
          - listitem [ref=e80]:
            - link "DatePicker" [ref=e81] [cursor=pointer]:
              - /url: /opinions/date-picker
          - listitem [ref=e82]:
            - link "Dialog" [ref=e83] [cursor=pointer]:
              - /url: /opinions/dialog
          - listitem [ref=e84]:
            - link "DistributionChart" [ref=e85] [cursor=pointer]:
              - /url: /opinions/distribution-chart
          - listitem [ref=e86]:
            - link "Drawer" [ref=e87] [cursor=pointer]:
              - /url: /opinions/drawer
          - listitem [ref=e88]:
            - link "Dropdown" [ref=e89] [cursor=pointer]:
              - /url: /opinions/dropdown
          - listitem [ref=e90]:
            - link "Editable" [ref=e91] [cursor=pointer]:
              - /url: /opinions/editable
          - listitem [ref=e92]:
            - link "Ellipsis" [ref=e93] [cursor=pointer]:
              - /url: /opinions/ellipsis
          - listitem [ref=e94]:
            - link "FileManager" [ref=e95] [cursor=pointer]:
              - /url: /opinions/file-manager
          - listitem [ref=e96]:
            - link "FileUpload" [ref=e97] [cursor=pointer]:
              - /url: /opinions/file-upload
          - listitem [ref=e98]:
            - link "FloatAssistant" [ref=e99] [cursor=pointer]:
              - /url: /opinions/float-assistant
          - listitem [ref=e100]:
            - link "FloatingBubble" [ref=e101] [cursor=pointer]:
              - /url: /opinions/floating-bubble
          - listitem [ref=e102]:
            - link "FloatingPanel" [ref=e103] [cursor=pointer]:
              - /url: /opinions/floating-panel
          - listitem [ref=e104]:
            - link "FloatingSelectionToolbar" [ref=e105] [cursor=pointer]:
              - /url: /opinions/floating-selection-toolbar
          - listitem [ref=e106]:
            - link "Flowchart" [ref=e107] [cursor=pointer]:
              - /url: /opinions/flowchart
          - listitem [ref=e108]:
            - link "Form" [ref=e109] [cursor=pointer]:
              - /url: /opinions/form
          - listitem [ref=e110]:
            - link "Goal Tracker" [ref=e111] [cursor=pointer]:
              - /url: /opinions/goal-tracker
          - listitem [ref=e112]:
            - link "GraphExplorer" [ref=e113] [cursor=pointer]:
              - /url: /opinions/graph-explorer
          - listitem [ref=e114]:
            - link "Heatmap" [ref=e115] [cursor=pointer]:
              - /url: /opinions/heatmap
          - listitem [ref=e116]:
            - link "Histogram" [ref=e117] [cursor=pointer]:
              - /url: /opinions/histogram
          - listitem [ref=e118]:
            - link "HoverCard" [ref=e119] [cursor=pointer]:
              - /url: /opinions/hover-card
          - listitem [ref=e120]:
            - link "Image" [ref=e121] [cursor=pointer]:
              - /url: /opinions/image
          - listitem [ref=e122]:
            - link "ImageCropper" [ref=e123] [cursor=pointer]:
              - /url: /opinions/image-cropper
          - listitem [ref=e124]:
            - link "IndexBar" [ref=e125] [cursor=pointer]:
              - /url: /opinions/index-bar
          - listitem [ref=e126]:
            - link "IndexChart" [ref=e127] [cursor=pointer]:
              - /url: /opinions/index-chart
          - listitem [ref=e128]:
            - link "Kanban" [ref=e129] [cursor=pointer]:
              - /url: /opinions/kanban
          - listitem [ref=e130]:
            - link "LayersPanel" [ref=e131] [cursor=pointer]:
              - /url: /opinions/layers-panel
          - listitem [ref=e132]:
            - link "Lightbox" [ref=e133] [cursor=pointer]:
              - /url: /opinions/lightbox
          - listitem [ref=e134]:
            - link "LineChart" [ref=e135] [cursor=pointer]:
              - /url: /opinions/line-chart
          - listitem [ref=e136]:
            - link "Mentions" [ref=e137] [cursor=pointer]:
              - /url: /opinions/mentions
          - listitem [ref=e138]:
            - link "Menubar" [ref=e139] [cursor=pointer]:
              - /url: /opinions/menubar
          - listitem [ref=e140]:
            - link "MindMap" [ref=e141] [cursor=pointer]:
              - /url: /opinions/mind-map
          - listitem [ref=e142]:
            - link "MultiSelect" [ref=e143] [cursor=pointer]:
              - /url: /opinions/multi-select
          - listitem [ref=e144]:
            - link "NodeLinkGraph" [ref=e145] [cursor=pointer]:
              - /url: /opinions/node-link-graph
          - listitem [ref=e146]:
            - link "NumberKeyboard" [ref=e147] [cursor=pointer]:
              - /url: /opinions/number-keyboard
          - listitem [ref=e148]:
            - link "OrgChart" [ref=e149] [cursor=pointer]:
              - /url: /opinions/org-chart
          - listitem [ref=e150]:
            - link "PackedBubbleChart" [ref=e151] [cursor=pointer]:
              - /url: /opinions/packed-bubble-chart
          - listitem [ref=e152]:
            - link "PertChart" [ref=e153] [cursor=pointer]:
              - /url: /opinions/pert-chart
          - listitem [ref=e154]:
            - link "PhoneInput" [ref=e155] [cursor=pointer]:
              - /url: /opinions/phone-input
          - listitem [ref=e156]:
            - link "PickerWheel" [ref=e157] [cursor=pointer]:
              - /url: /opinions/picker-wheel
          - listitem [ref=e158]:
            - link "Popconfirm" [ref=e159] [cursor=pointer]:
              - /url: /opinions/popconfirm
          - listitem [ref=e160]:
            - link "Popover" [ref=e161] [cursor=pointer]:
              - /url: /opinions/popover
          - listitem [ref=e162]:
            - link "PullToRefresh" [ref=e163] [cursor=pointer]:
              - /url: /opinions/pull-to-refresh
          - listitem [ref=e164]:
            - link "RadarChart" [ref=e165] [cursor=pointer]:
              - /url: /opinions/radar-chart
          - listitem [ref=e166]:
            - link "ResizablePanels" [ref=e167] [cursor=pointer]:
              - /url: /opinions/resizable-panels
          - listitem [ref=e168]:
            - link "RibbonChart" [ref=e169] [cursor=pointer]:
              - /url: /opinions/ribbon-chart
          - listitem [ref=e170]:
            - link "RichTextEditor" [ref=e171] [cursor=pointer]:
              - /url: /opinions/rich-text-editor
          - listitem [ref=e172]:
            - link "ScatterChart" [ref=e173] [cursor=pointer]:
              - /url: /opinions/scatter-chart
          - listitem [ref=e174]:
            - link "Select" [ref=e175] [cursor=pointer]:
              - /url: /opinions/select
          - listitem [ref=e176]:
            - link "ShapeGallery" [ref=e177] [cursor=pointer]:
              - /url: /opinions/shape-gallery
          - listitem [ref=e178]:
            - link "SignaturePad" [ref=e179] [cursor=pointer]:
              - /url: /opinions/signature-pad
          - listitem [ref=e180]:
            - link "SlashCommandMenu" [ref=e181] [cursor=pointer]:
              - /url: /opinions/slash-command-menu
          - listitem [ref=e182]:
            - link "SpeedDial" [ref=e183] [cursor=pointer]:
              - /url: /opinions/speed-dial
          - listitem [ref=e184]:
            - link "SplitButton" [ref=e185] [cursor=pointer]:
              - /url: /opinions/split-button
          - listitem [ref=e186]:
            - link "StackedAreaChart" [ref=e187] [cursor=pointer]:
              - /url: /opinions/stacked-area-chart
          - listitem [ref=e188]:
            - link "StackedBarChart" [ref=e189] [cursor=pointer]:
              - /url: /opinions/stacked-bar-chart
          - listitem [ref=e190]:
            - link "StackedLineChart" [ref=e191] [cursor=pointer]:
              - /url: /opinions/stacked-line-chart
          - listitem [ref=e192]:
            - link "StepChart" [ref=e193] [cursor=pointer]:
              - /url: /opinions/step-chart
          - listitem [ref=e194]:
            - link "Sticky Kanban" [ref=e195] [cursor=pointer]:
              - /url: /opinions/sticky-kanban
          - listitem [ref=e196]:
            - link "SwipeActions" [ref=e197] [cursor=pointer]:
              - /url: /opinions/swipe-actions
          - listitem [ref=e198]:
            - link "Table" [ref=e199] [cursor=pointer]:
              - /url: /opinions/table
          - listitem [ref=e200]:
            - link "Tabs" [ref=e201] [cursor=pointer]:
              - /url: /opinions/tabs
          - listitem [ref=e202]:
            - link "TagInput" [ref=e203] [cursor=pointer]:
              - /url: /opinions/tag-input
          - listitem [ref=e204]:
            - link "TextToSpeechBar" [ref=e205] [cursor=pointer]:
              - /url: /opinions/text-to-speech-bar
          - listitem [ref=e206]:
            - link "ThemeToggle" [ref=e207] [cursor=pointer]:
              - /url: /opinions/theme-toggle
          - listitem [ref=e208]:
            - link "TimePicker" [ref=e209] [cursor=pointer]:
              - /url: /opinions/time-picker
          - listitem [ref=e210]:
            - link "Toast" [ref=e211] [cursor=pointer]:
              - /url: /opinions/toast
          - listitem [ref=e212]:
            - link "TodoItem" [ref=e213] [cursor=pointer]:
              - /url: /opinions/todo-item
          - listitem [ref=e214]:
            - link "Tooltip" [ref=e215] [cursor=pointer]:
              - /url: /opinions/tooltip
          - listitem [ref=e216]:
            - link "Tour" [ref=e217] [cursor=pointer]:
              - /url: /opinions/tour
          - listitem [ref=e218]:
            - link "Transfer" [ref=e219] [cursor=pointer]:
              - /url: /opinions/transfer
          - listitem [ref=e220]:
            - link "TreeSelect" [ref=e221] [cursor=pointer]:
              - /url: /opinions/tree-select
          - listitem [ref=e222]:
            - link "TreeView" [ref=e223] [cursor=pointer]:
              - /url: /opinions/tree-view
          - listitem [ref=e224]:
            - link "UMAPPlot" [ref=e225] [cursor=pointer]:
              - /url: /opinions/umap-plot
          - listitem [ref=e226]:
            - link "UploadQueue" [ref=e227] [cursor=pointer]:
              - /url: /opinions/upload-queue
          - listitem [ref=e228]:
            - link "VersionHistory" [ref=e229] [cursor=pointer]:
              - /url: /opinions/version-history
          - listitem [ref=e230]:
            - link "VideoPlayer" [ref=e231] [cursor=pointer]:
              - /url: /opinions/video-player
          - listitem [ref=e232]:
            - link "VoiceComposer" [ref=e233] [cursor=pointer]:
              - /url: /opinions/voice-composer
          - listitem [ref=e234]:
            - link "WaveformAudioPlayer" [ref=e235] [cursor=pointer]:
              - /url: /opinions/waveform-audio-player
          - listitem [ref=e236]:
            - link "Wizard" [ref=e237] [cursor=pointer]:
              - /url: /opinions/wizard
          - listitem [ref=e238]:
            - link "WorkspaceSwitcher" [ref=e239] [cursor=pointer]:
              - /url: /opinions/workspace-switcher
      - generic [ref=e241]:
        - heading "FloatAssistant" [level=1] [ref=e242]
        - paragraph [ref=e243]: A floating AI assistant with drag-to-move physics, minimize-to-dot, voice and text modes, and server-side API proxy integration. The assistant is 100% transparent about being an AI — it never pretends to be human.
        - generic:
          - button "Close assistant" [expanded] [ref=e244]
          - button "Minimize assistant"
          - dialog "Rebar Demo assistant":
            - generic:
              - generic:
                - generic:
                  - generic: Rebar Demo
                  - generic: Online
              - generic:
                - button "Switch to voice mode"
            - generic:
              - generic:
                - generic:
                  - generic: Hi! I'm a demo assistant. Try dragging me around, or minimize me to a dot!
                  - generic: 07:43 PM
            - generic:
              - generic:
                - textbox "Message input" [active]:
                  - /placeholder: Type your message...
                - button "Send message" [disabled]
            - generic: AI can make mistakes. Check important info.
        - generic [ref=e249]:
          - generic [ref=e250]:
            - heading "Overview" [level=2] [ref=e252]
            - paragraph [ref=e253]: A floating AI assistant button that expands into a chat/voice interface. Features dynamic orb animations, drag-to-move with physics, minimize to a 15×15px dot, and transparent AI interaction design. Supports text and voice input modes, with API integration for Qwen LLM, Qwen TTS/STT, and the OpenKnowledge (Rebar Super) service.
          - generic [ref=e254]:
            - heading "Shape" [level=2] [ref=e256]
            - generic [ref=e257]:
              - button "Copy" [ref=e259] [cursor=pointer]
              - code [ref=e261]: "{ type: \"float-assistant\", name?: string, greeting?: string, position?: \"bottom-right\" | \"bottom-left\" | \"top-right\" | \"top-left\", accentColor?: string, voiceEnabled?: boolean, draggable?: boolean, minimizable?: boolean, apiEndpoint?: string, apiAuthToken?: string, }"
          - generic [ref=e262]:
            - heading "Props" [level=2] [ref=e263]
            - table [ref=e265]:
              - rowgroup [ref=e266]:
                - row [ref=e267]:
                  - columnheader "Prop" [ref=e268]
                  - columnheader "Type" [ref=e269]
                  - columnheader "Required" [ref=e270]
                  - columnheader "Default" [ref=e271]
              - rowgroup [ref=e272]:
                - row [ref=e273]:
                  - cell [ref=e274]:
                    - code [ref=e275]: name
                  - cell [ref=e276]:
                    - code [ref=e277]: string | undefined
                  - cell "No" [ref=e278]
                  - cell "Assistant" [ref=e279]
                - row [ref=e280]:
                  - cell [ref=e281]:
                    - code [ref=e282]: greeting
                  - cell [ref=e283]:
                    - code [ref=e284]: string | undefined
                  - cell "No" [ref=e285]
                  - cell "Hi! How can I help you today?" [ref=e286]
                - row [ref=e287]:
                  - cell [ref=e288]:
                    - code [ref=e289]: position
                  - cell [ref=e290]:
                    - code [ref=e291]: "\"bottom-right\" | \"bottom-left\" | \"top-right\" | \"top-left\" | undefined"
                  - cell "No" [ref=e292]
                  - cell "bottom-right" [ref=e293]
                - row [ref=e294]:
                  - cell [ref=e295]:
                    - code [ref=e296]: accentColor
                  - cell [ref=e297]:
                    - code [ref=e298]: string | undefined
                  - cell "No" [ref=e299]
                  - 'cell "var(--rebar-color-primary, #0066cc)" [ref=e300]'
                - row [ref=e301]:
                  - cell [ref=e302]:
                    - code [ref=e303]: onSendMessage
                  - cell [ref=e304]:
                    - code [ref=e305]: "((message: string) => void) | undefined"
                  - cell "No" [ref=e306]
                  - cell "—" [ref=e307]
                - row [ref=e308]:
                  - cell [ref=e309]:
                    - code [ref=e310]: onVoiceRecord
                  - cell [ref=e311]:
                    - code [ref=e312]: "((recording: boolean) => void) | undefined"
                  - cell "No" [ref=e313]
                  - cell "—" [ref=e314]
                - row [ref=e315]:
                  - cell [ref=e316]:
                    - code [ref=e317]: voiceEnabled
                  - cell [ref=e318]:
                    - code [ref=e319]: boolean | undefined
                  - cell "No" [ref=e320]
                  - cell "true" [ref=e321]
                - row [ref=e322]:
                  - cell [ref=e323]:
                    - code [ref=e324]: mode
                  - cell [ref=e325]:
                    - code [ref=e326]: "\"text\" | \"voice\" | undefined"
                  - cell "No" [ref=e327]
                  - cell "—" [ref=e328]
                - row [ref=e329]:
                  - cell [ref=e330]:
                    - code [ref=e331]: onModeChange
                  - cell [ref=e332]:
                    - code [ref=e333]: "((mode: \"text\" | \"voice\") => void) | undefined"
                  - cell "No" [ref=e334]
                  - cell "—" [ref=e335]
                - row [ref=e336]:
                  - cell [ref=e337]:
                    - code [ref=e338]: draggable
                  - cell [ref=e339]:
                    - code [ref=e340]: boolean | undefined
                  - cell "No" [ref=e341]
                  - cell "true" [ref=e342]
                - row [ref=e343]:
                  - cell [ref=e344]:
                    - code [ref=e345]: minimizable
                  - cell [ref=e346]:
                    - code [ref=e347]: boolean | undefined
                  - cell "No" [ref=e348]
                  - cell "true" [ref=e349]
                - row [ref=e350]:
                  - cell [ref=e351]:
                    - code [ref=e352]: apiEndpoint
                  - cell [ref=e353]:
                    - code [ref=e354]: string | undefined
                  - cell "No" [ref=e355]
                  - cell "—" [ref=e356]
                - row [ref=e357]:
                  - cell [ref=e358]:
                    - code [ref=e359]: apiAuthToken
                  - cell [ref=e360]:
                    - code [ref=e361]: string | undefined
                  - cell "No" [ref=e362]
                  - cell "—" [ref=e363]
                - row [ref=e364]:
                  - cell [ref=e365]:
                    - code [ref=e366]: className
                  - cell [ref=e367]:
                    - code [ref=e368]: string | undefined
                  - cell "No" [ref=e369]
                  - cell "—" [ref=e370]
                - row [ref=e371]:
                  - cell [ref=e372]:
                    - code [ref=e373]: bionic
                  - cell [ref=e374]:
                    - code [ref=e375]: boolean | undefined
                  - cell "No" [ref=e376]
                  - cell "—" [ref=e377]
                - row [ref=e378]:
                  - cell [ref=e379]:
                    - code [ref=e380]: bionicOptions
                  - cell [ref=e381]:
                    - code [ref=e382]: BionicOptions | undefined
                  - cell "No" [ref=e383]
                  - cell "—" [ref=e384]
          - generic [ref=e385]:
            - heading "API Integration" [level=2] [ref=e387]
            - paragraph [ref=e388]:
              - text: The FloatAssistant uses a *
              - emphasis [ref=e389]: server-side proxy pattern
              - text: "* for security. The app developer implements an API endpoint that holds API keys securely server-side. The construct never sees real API keys."
            - paragraph [ref=e390]:
              - text: "*"
              - emphasis [ref=e391]: "Endpoint contract:"
              - text: "*"
            - generic [ref=e392]:
              - button "Copy" [ref=e394] [cursor=pointer]
              - code [ref=e396]: "POST /api/assistant/chat Content-Type: application/json Authorization: Bearer <session-token> { \"message\": \"What is the weather?\", \"history\": [ { \"role\": \"user\", \"content\": \"Hello\" }, { \"role\": \"assistant\", \"content\": \"Hi there!\" } ] } Response: { \"reply\": \"I don't have access to weather data, but...\" }"
            - paragraph [ref=e397]: The server endpoint then calls Qwen LLM, OpenKnowledge, or any other service with the real API keys stored in environment variables.
          - generic [ref=e398]:
            - heading "Features" [level=2] [ref=e400]
            - paragraph [ref=e401]:
              - text: "*"
              - emphasis [ref=e402]: Drag with physics
              - text: "* — Click and drag the button to move it anywhere on screen. When released with momentum, it continues moving with friction until it stops."
            - paragraph [ref=e403]:
              - text: "*"
              - emphasis [ref=e404]: Minimize to dot
              - text: "* — Click the minimize button to collapse to a 15×15px dot in the bottom-right corner. Click the dot to expand again."
            - paragraph [ref=e405]:
              - text: "*"
              - emphasis [ref=e406]: Voice mode
              - text: "* — Toggle between text and voice input. In voice mode, click the microphone to start recording. Visual wave animation shows recording activity."
            - paragraph [ref=e407]:
              - text: "*"
              - emphasis [ref=e408]: Transparent AI
              - text: "* — The footer disclaimer reminds users that AI can make mistakes. The assistant never pretends to be human."
          - generic [ref=e409]:
            - heading "Accessibility" [level=2] [ref=e411]
            - paragraph [ref=e412]:
              - text: Real
              - code [ref=e413]: role="dialog"
              - text: when expanded, proper
              - code [ref=e414]: aria-label
              - text: and
              - code [ref=e415]: aria-expanded
              - text: states, keyboard-navigable controls, and visible focus indicators. The floating button is always reachable via Tab.
          - generic [ref=e416]:
            - heading "data-rebar-* attributes" [level=2] [ref=e418]
            - paragraph [ref=e419]:
              - code [ref=e420]: data-rebar-component="float-assistant"
              - text: ","
              - code [ref=e421]: data-rebar-part="trigger"
              - text: on the button,
              - code [ref=e422]: data-rebar-part="panel"
              - text: on the expanded panel,
              - code [ref=e423]: data-rebar-part="messages"
              - text: on the message list.
  - contentinfo [ref=e424]:
    - generic [ref=e425]:
      - paragraph [ref=e426]:
        - text: MIT licensed.
        - link "Source on GitHub" [ref=e427] [cursor=pointer]:
          - /url: https://github.com/ob27/rebarui
        - text: .
      - generic [ref=e428]:
        - link "About" [ref=e429] [cursor=pointer]:
          - /url: /about
        - link "Design Heuristics" [ref=e430] [cursor=pointer]:
          - /url: /about/agent
        - link "Benchmarks" [ref=e431] [cursor=pointer]:
          - /url: /about/benchmarks
        - link "Contributing" [ref=e432] [cursor=pointer]:
          - /url: https://github.com/ob27/rebarui/blob/main/CONTRIBUTING.md
  - button "Open Next.js Dev Tools" [ref=e438] [cursor=pointer]
  - alert [ref=e442]
  - button "Rebar DevTools" [ref=e444] [cursor=pointer]: 🔧
```

# Test source

```ts
  11  |     });
  12  | 
  13  |     // Navigate to the float assistant page
  14  |     await page.goto("/opinions/float-assistant");
  15  |     await page.waitForLoadState("networkidle");
  16  | 
  17  |     // Wait for the assistant button to appear
  18  |     const assistantButton = page.locator('[data-rebar-part="trigger"]');
  19  |     await expect(assistantButton).toBeVisible({ timeout: 5000 });
  20  | 
  21  |     // Check for canvas color parsing errors
  22  |     const colorErrors = errors.filter((e) =>
  23  |       e.includes("addColorStop") && e.includes("could not be parsed as a color")
  24  |     );
  25  |     expect(colorErrors).toHaveLength(0);
  26  | 
  27  |     // Verify the canvas is rendering (should have content)
  28  |     const canvas = page.locator("canvas.rebar-float-assistant-orb-canvas");
  29  |     await expect(canvas).toBeVisible();
  30  |   });
  31  | 
  32  |   test("assistant button is draggable", async ({ page }) => {
  33  |     await page.goto("/opinions/float-assistant");
  34  |     await page.waitForLoadState("networkidle");
  35  | 
  36  |     const assistantButton = page.locator('[data-rebar-part="trigger"]');
  37  |     await expect(assistantButton).toBeVisible();
  38  | 
  39  |     // Get initial position
  40  |     const initialBox = await assistantButton.boundingBox();
  41  |     expect(initialBox).not.toBeNull();
  42  | 
  43  |     // Drag the button
  44  |     if (initialBox) {
  45  |       const startX = initialBox.x + initialBox.width / 2;
  46  |       const startY = initialBox.y + initialBox.height / 2;
  47  | 
  48  |       await page.mouse.move(startX, startY);
  49  |       await page.mouse.down();
  50  |       await page.mouse.move(startX + 100, startY + 100, { steps: 10 });
  51  |       await page.mouse.up();
  52  | 
  53  |       // Verify position changed
  54  |       const newBox = await assistantButton.boundingBox();
  55  |       expect(newBox).not.toBeNull();
  56  |       if (newBox) {
  57  |         expect(Math.abs(newBox.x - initialBox.x)).toBeGreaterThan(10);
  58  |       }
  59  |     }
  60  |   });
  61  | 
  62  |   test("panel appears when button is clicked", async ({ page }) => {
  63  |     await page.goto("/opinions/float-assistant");
  64  |     await page.waitForLoadState("networkidle");
  65  | 
  66  |     const assistantButton = page.locator('[data-rebar-part="trigger"]');
  67  |     await assistantButton.click();
  68  | 
  69  |     // Panel should appear
  70  |     const panel = page.locator('[data-rebar-part="panel"]');
  71  |     await expect(panel).toBeVisible({ timeout: 3000 });
  72  |   });
  73  | 
  74  |   test("panel stays within viewport bounds", async ({ page }) => {
  75  |     await page.goto("/opinions/float-assistant");
  76  |     await page.waitForLoadState("networkidle");
  77  | 
  78  |     const assistantButton = page.locator('[data-rebar-part="trigger"]');
  79  |     await assistantButton.click();
  80  | 
  81  |     const panel = page.locator('[data-rebar-part="panel"]');
  82  |     await expect(panel).toBeVisible();
  83  | 
  84  |     // Get panel and viewport dimensions
  85  |     const panelBox = await panel.boundingBox();
  86  |     const viewport = page.viewportSize();
  87  | 
  88  |     expect(panelBox).not.toBeNull();
  89  |     expect(viewport).not.toBeNull();
  90  | 
  91  |     if (panelBox && viewport) {
  92  |       // Panel should not exceed viewport
  93  |       expect(panelBox.x).toBeGreaterThanOrEqual(0);
  94  |       expect(panelBox.y).toBeGreaterThanOrEqual(0);
  95  |       expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(viewport.width);
  96  |       expect(panelBox.y + panelBox.height).toBeLessThanOrEqual(viewport.height);
  97  |     }
  98  |   });
  99  | 
  100 |   test("minimize button collapses to dot", async ({ page }) => {
  101 |     await page.goto("/opinions/float-assistant");
  102 |     await page.waitForLoadState("networkidle");
  103 | 
  104 |     // Open the assistant first
  105 |     const assistantButton = page.locator('[data-rebar-part="trigger"]');
  106 |     await assistantButton.click();
  107 | 
  108 |     // Click minimize button
  109 |     const minimizeBtn = page.locator('[aria-label="Minimize assistant"]');
  110 |     await expect(minimizeBtn).toBeVisible();
> 111 |     await minimizeBtn.click();
      |                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
  112 | 
  113 |     // Button should now be minimized (smaller)
  114 |     const buttonBox = await assistantButton.boundingBox();
  115 |     expect(buttonBox).not.toBeNull();
  116 |     if (buttonBox) {
  117 |       // Minimized button should be 15x15px
  118 |       expect(buttonBox.width).toBeCloseTo(15, 0);
  119 |       expect(buttonBox.height).toBeCloseTo(15, 0);
  120 |     }
  121 |   });
  122 | });
  123 | 
```