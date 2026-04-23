# Accessibility Features

This project includes a custom accessibility controller specifically designed for content pages. This tool allows you to customize the reading experience without affecting the rest of the site's interface.

## Available Adjustments

- **Font Style**: Choose from several local font options (Sans-serif, Serif, Monospace).
- **Text Size**: Scale the content text from 80% to 150%.
- **Line Spacing**: Adjust the height between lines for better readability (1.0x to 2.0x).
- **Word Spacing**: Increase or decrease the space between words.
- **Letter Spacing**: Adjust the tracking between individual characters.
- **High Contrast**: Enable a high-contrast mode specifically for the article body.

## How to Use

1. Navigate to any content page (Blog, Articles, Tutorials, Projects, or Wiki).
2. Look for the floating accessibility icon (recognizable by the universal accessibility symbol) at the bottom-right of your screen.
3. Click the button to open the **Control Panel**.
4. Use the sliders and toggles to adjust the settings to your preference.
5. Your settings will be automatically saved to your browser and will persist across sessions.

## Technical Notes

- **Scoped Application**: All changes are strictly scoped to the article content area. Navigation, sidebars, and footers remain unchanged to maintain site consistency and navigation reliability.
- **Local Fonts Only**: We use only high-quality local fonts configured within the project to ensure performance and privacy.
- **Persistence**: Preferences are stored in `localStorage` under the key `accessibility-preferences`.
- **Keyboard Navigation**: The control panel is fully accessible via keyboard. Use `Tab` to navigate and `Space`/`Enter` to toggle or adjust settings. Press `Escape` to close the panel.
- **Draggable Interface**: On desktop, you can drag the accessibility button to any position on the screen if it obstructs your view.
