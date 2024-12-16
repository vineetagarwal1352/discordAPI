const axios = require('axios');

// Replace with your Discord Bot Token and Application ID
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const BASE_API_URL = 'https://discord.com/api/v10';

app.use(bodyParser.json());

// Set up a route to handle the interactions from Discord (slash commands)
app.post('/interactions', async (req, res) => {
  const interaction = req.body;

  // Check for interaction type and handle accordingly
  if (interaction.type === 1) {
    // Respond with a "ping" to acknowledge the interaction
    return res.json({ type: 1 });
  }

  // Handle the slash command interactions
  if (interaction.type === 1 || interaction.type === 2) {
    const commandName = interaction.data.name;

    switch (commandName) {
      case 'ppcreateuser':
        await handleCreateUserCommand(interaction, res);
        break;
      case 'ppcreateservice':
        await handleCreateServiceCommand(interaction, res);
        break;
      case 'ppgetuser':
        await handleGetUserCommand(interaction, res);
        break;
      default:
        res.json({ type: 4, data: { content: 'Unknown command.' } });
    }
  }
});

// Handle creating a user
const handleCreateUserCommand = async (interaction, res) => {
  const { username, email, password } = interaction.data.options.reduce((acc, option) => {
    acc[option.name] = option.value;
    return acc;
  }, {});

  // Simulate creating a user (replace with real database logic)
  const userCreated = true; // Assume user creation is successful

  if (userCreated) {
    res.json({
      type: 4,
      data: { content: `User ${username} created successfully with email ${email}!` },
    });
  } else {
    res.json({
      type: 4,
      data: { content: `Failed to create user ${username}. Please try again.` },
    });
  }
};

// Handle creating a service
const handleCreateServiceCommand = async (interaction, res) => {
  const { serviceName, serviceLink, monthlyFee } = interaction.data.options.reduce((acc, option) => {
    acc[option.name] = option.value;
    return acc;
  }, {});

  // Simulate service creation (replace with real logic)
  const serviceCreated = true; // Assume service creation is successful

  if (serviceCreated) {
    res.json({
      type: 4,
      data: { content: `Service ${serviceName} created successfully with link ${serviceLink} and monthly fee $${monthlyFee}!` },
    });
  } else {
    res.json({
      type: 4,
      data: { content: `Failed to create service ${serviceName}. Please try again.` },
    });
  }
};

// Handle fetching user details
const handleGetUserCommand = async (interaction, res) => {
  const { username } = interaction.data.options.reduce((acc, option) => {
    acc[option.name] = option.value;
    return acc;
  }, {});

  // Simulate fetching user and associated services (replace with real logic)
  const userExists = true; // Assume user exists
  const userServices = [
    { serviceName: 'Youtube', serviceLink: 'https://fgf.vf', monthlyFee: '$3.00' },
  ]; // Example services

  if (userExists) {
    const userData = {
      username,
      services: userServices,
    };

    res.json({
      type: 4,
      data: {
        content: `User: ${userData.username}, Services: ${JSON.stringify(userData.services)}`,
      },
    });
  } else {
    res.json({
      type: 4,
      data: { content: `User ${username} does not exist.` },
    });
  }
};

// Register commands for your bot (if not already registered)
const registerSlashCommands = async () => {
  const commands = [
    {
      name: 'ppcreateuser',
      description: 'Creates a new user',
      options: [
        { name: 'username', description: 'The username', type: 3, required: true },
        { name: 'email', description: 'The email address', type: 3, required: true },
        { name: 'password', description: 'Password for the user', type: 3, required: true },
      ],
    },
    {
      name: 'ppcreateservice',
      description: 'Creates a new service',
      options: [
        { name: 'serviceName', description: 'The name of the service', type: 3, required: true },
        { name: 'serviceLink', description: 'The service link', type: 3, required: true },
        { name: 'monthlyFee', description: 'The monthly fee', type: 3, required: true },
      ],
    },
    {
      name: 'ppgetuser',
      description: 'Fetch user and associated services',
      options: [{ name: 'username', description: 'The username', type: 3, required: true }],
    },
  ];

  try {
    const response = await axios.post(
      `${BASE_API_URL}/applications/${CLIENT_ID}/guilds/${GUILD_ID}/commands`,
      commands,
      {
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
      }
    );
    console.log('Commands registered successfully:', response.data);
  } catch (error) {
    console.error('Error registering commands:', error);
  }
};

// Call registerSlashCommands when the application starts
registerSlashCommands();

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
