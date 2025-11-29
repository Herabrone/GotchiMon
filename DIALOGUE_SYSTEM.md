**This was written by Chat to explain how the dialogue system works



# Dialogue System Architecture

## Overview
The dialogue system uses React Context to manage dialogue state across pages, allowing players to navigate through branching conversations that persist as they move between game screens.

---

## File Structure

```
src/
├── components/
│   ├── Dialogue.jsx           # Main dialogue UI component
│   └── dialogueTree.js        # Dialogue content/data
├── utils/
│   ├── dialogueContext.jsx    # Global dialogue state management
│   └── TextWriter.jsx         # Text animation utility
```

---

## Core Components

### 1. **dialogueTree.js** - Dialogue Content
Location: `src/components/dialogueTree.js`

This is where all dialogue content lives. Each node represents one dialogue screen.

**Structure:**
```javascript
const dialogueTree = {
    nodeId: {
        text: "The dialogue text to display",
        options: [
            { text: "Button text", next: "nextNodeId" },
            { text: "Another option", next: "anotherNodeId" },
        ],
    },
};
```

**Key Properties:**
- `nodeId` (string): Unique identifier for this dialogue node
- `text` (string): The dialogue text shown to player
- `options` (array): Array of choices for the player
  - `text`: Text shown on the button
  - `next`: ID of the next node (use `null` to end dialogue)


### 2. **dialogueContext.jsx** - State Management

Manages dialogue state globally using React Context, allowing dialogue to persist across page navigation.

**Available from `useDialogue()`:**
```javascript
const { 
    currentNode,          // Current dialogue node ID (string)
    isDialogueActive,     // Whether dialogue is currently active (boolean)
    advanceDialogue,      // Function to move to next node
    resetDialogue,        // Function to restart dialogue from 'start'
    setIsDialogueActive   // Function to activate/deactivate dialogue
} = useDialogue();
```

**Functions:**
- `advanceDialogue(nextNodeId)`: Move to a specific node or end dialogue if `null`
- `resetDialogue()`: Reset to 'start' node and activate dialogue
- `setIsDialogueActive(true/false)`: Manually activate or deactivate dialogue

---

### 3. **Dialogue.jsx** - UI Component
Location: `src/components/Dialogue.jsx`

Renders the dialogue UI with text animation and choice buttons.


### Conditional Dialogue Based on State

You can check game state before activating dialogue:

```jsx
const { setIsDialogueActive, resetDialogue } = useDialogue();
const [hasSeenIntro, setHasSeenIntro] = useState(false);

React.useEffect(() => {
    if (!hasSeenIntro) {
        resetDialogue(); // Start from beginning
        setIsDialogueActive(true);
        setHasSeenIntro(true);
    }
}, []);
```

### Adding Actions to Options

You can extend the dialogue tree to support actions:

**In `dialogueTree.js`:**
```javascript
myNode: {
    text: "Ready to battle?",
    options: [
        { 
            text: "Fight!", 
            next: null, 
            action: "startBattle" // Custom action
        },
    ],
}
```

**In `Dialogue.jsx`:**
```jsx
export default function Dialogue({ onAction }) {
    // ... existing code ...

    const handleOptionClick = (option) => {
        if (option.action && onAction) {
            onAction(option.action); // Trigger custom action
        }
        advanceDialogue(option.next);
    };

    return (
        <div className="dialogue">
            {/* ... */}
            <button onClick={() => handleOptionClick(opt)}>
                {opt.text}
            </button>
        </div>
    );
}
```

**In your page:**
```jsx
const handleAction = (action) => {
    if (action === "startBattle") {
        navigate("/battle");
    }
};

<Dialogue onAction={handleAction} />
```

## Quick Reference

### Adding Dialogue to a Page
```jsx
import { useDialogue } from "../utils/dialogueContext";
import Dialogue from '../components/Dialogue';

const { setIsDialogueActive } = useDialogue();
React.useEffect(() => setIsDialogueActive(true), []);
return <Dialogue />;
```

### Creating a Simple Dialogue
```javascript
const dialogueTree = {
    start: {
        text: "Hello!",
        options: [{ text: "Hi!", next: null }],
    },
};
```

### Checking if Dialogue is Active
```jsx
const { isDialogueActive } = useDialogue();
if (isDialogueActive) { /* do something */ }
```
