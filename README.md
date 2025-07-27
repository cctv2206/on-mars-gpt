# 🚀 On Mars - AI-Powered Multiplayer Adventure

![On Mars Logo](public/logo.jpg)

> *Explore, build, and shape the future of Mars in this AI-powered multiplayer text adventure sandbox*

**On Mars** is an innovative multiplayer online text adventure sandbox game where players asynchronously explore and shape a shared Martian world. Powered by ChatGPT plugins, players collaborate with AI to uncover hidden stories across the Red Planet while their actions permanently alter the world for future explorers.

🎮 **[Try the Demo Now!](https://123games.fun/)** - Experience the live version directly in ChatGPT

This repository contains the open-source framework that powers On Mars. You can use this framework to build your own AI-powered multiplayer games or contribute to expanding the Mars universe.

## 🌟 Features

### 🌍 **Shared Persistent World**
- **Asynchronous Multiplayer**: Players explore the same Mars simultaneously, with actions affecting the shared world state
- **Persistent Locations**: Every coordinate (x,y) on Mars from -10 to 10 maintains its own history and evolving story
- **Dynamic World Evolution**: Player actions create lasting changes that future explorers will discover

### 🤖 **AI-Powered Storytelling**
- **Intelligent Narrative Generation**: ChatGPT dynamically creates unique stories and scenarios for each location
- **Adaptive Responses**: AI interprets player actions and evolves the story accordingly
- **Visual Storytelling**: Automatically generated 16:9 images bring each location and action to life

### 🎮 **Rich Gameplay**
- **Open Sandbox**: Build, explore, interact with characters, or forge your own path
- **Location-Based Adventures**: Each coordinate offers unique challenges and discoveries
- **Story Discovery**: Uncover hidden narratives scattered across the Martian landscape
- **User-Driven Narrative**: Your choices shape not just your story, but the world itself

## 🛠 Technology Stack

- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL for persistent world state
- **Deployment**: Vercel Serverless Functions
- **AI Integration**: ChatGPT Plugin Architecture
- **Plugin Management**: PluginLab for OAuth and monetization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- PluginLab account (for plugin deployment)
- ChatGPT Plus subscription (required for plugin access)

### 🛠 Local API Development

**Note**: Local development allows you to test and develop the API endpoints, but the full game experience requires ChatGPT integration and can only be tested online.

1. **Clone the repository**
   ```bash
   git clone https://github.com/cctv2206/on-mars-gpt.git
   cd on-mars-gpt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Initialize database**
   ```bash
   npm run db:setup
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Your API server is now running at `http://localhost:3000`! You can test individual endpoints, but the AI-powered game mechanics require ChatGPT integration.

### 🎮 Full Game Setup (ChatGPT Integration)

To experience or debug the complete game with AI storytelling and image generation:

1. **Deploy your API** to a public URL (Vercel, Railway, etc.)

2. **Configure ChatGPT Plugin via PluginLab**:
   - Go to [PluginLab](https://app.pluginlab.ai)
   - Create a new plugin using your deployed API URL
   - Upload the OpenAPI schema from `gpt/gpt_schema.json`
   - Configure authentication and settings

3. **Test in ChatGPT**:
   - Enable your plugin in ChatGPT
   - Start with: "Take me to Mars coordinate 0,0"
   - Experience the full AI-powered adventure!

### 🔧 Development Workflow

- **API Changes**: Test locally with tools like Postman/curl
- **Game Logic**: Must be tested online through ChatGPT after deployment
- **Prompt Tuning**: Edit `gpt/prompt.md` and redeploy to test AI behavior changes

## 🎯 How to Play

1. **Enter ChatGPT** with the "On Mars" plugin enabled
2. **Start your adventure**: "Take me to Mars coordinate 5,3"
3. **Explore**: The AI will describe what you find and generate images
4. **Interact**: Build, explore, meet characters, or create your own adventure
5. **Leave your mark**: Your actions are saved and will affect future players

## 📁 Project Structure

```
on-mars-gpt/
├── api/                 # API endpoints
├── gpt/                 # ChatGPT plugin configuration
│   ├── gpt_schema.json  # OpenAPI schema for ChatGPT
│   └── prompt.md        # AI behavior instructions
├── middleware/          # Authentication and security
├── model/              # Data models
├── pg/                 # Database setup and queries
├── services/           # Business logic
└── util/               # Helper utilities
```

## 🤝 Contributing & Building Your Own Game

### 🌍 **Contributing to On Mars**
We welcome contributions to expand the Martian universe! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Add new locations, improve AI interactions, or enhance gameplay
4. **Test thoroughly**: Ensure your changes work in the multiplayer environment
5. **Submit a pull request**: We'll review and merge approved changes

### 🛠 **Building Your Own Game**
This framework is designed to be adaptable! You can create your own AI-powered multiplayer adventures:

1. **Clone this repository** as your starting point
2. **Modify the game world**: Change the setting from Mars to anywhere you imagine
3. **Customize the AI prompts**: Edit `gpt/prompt.md` to define your game's personality
4. **Adapt the data models**: Modify the database schema to fit your game mechanics
5. **Deploy your version**: Use the same PluginLab + Vercel setup

### 💡 **Ideas for Contributions & New Games**
- **For On Mars**: New location types, enhanced AI personalities, multiplayer features, world events
- **New Game Ideas**: Medieval fantasy kingdoms, underwater exploration, space stations, time travel adventures
- **Framework Improvements**: Better AI integration, enhanced multiplayer features, new game mechanics

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Built with [PluginLab](https://app.pluginlab.ai) for seamless ChatGPT integration
- Powered by OpenAI's ChatGPT for dynamic storytelling
- Inspired by classic text adventures and modern sandbox games

---

**Ready to make history on Mars?** 🚀

*Join thousands of explorers shaping the future of the Red Planet, one adventure at a time.*

