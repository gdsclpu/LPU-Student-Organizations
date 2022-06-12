interface IVoiceCommandObject {
  commands: string[];
  responses: string[];
  actions: string[];
  info: string;
}

export interface IVoiceCommandsDataJSON {
  stopCommands: IVoiceCommandObject;
  navigation: IVoiceCommandObject;
  scrolling: IVoiceCommandObject;
  openCommands: IVoiceCommandObject;
  explainCommands: IVoiceCommandObject;
}

export const voiceCommandsDataJSON: IVoiceCommandsDataJSON = {
  explainCommands: {
    commands: ['explain command '],
    responses: ['This command is used to *'],
    actions: ['explainCommands'],
    info: 'Explains the particular command',
  },
  stopCommands: {
    commands: ['stop', 'exit', 'quit'],
    responses: ['Bye', 'Goodbye', 'See you later'],
    actions: ['stop'],
    info: 'Stops Listening voice commands',
  },
  navigation: {
    commands: ['navigate to ', 'go to ', 'show me ', 'move to '],
    responses: ['Navigated to '],
    actions: ['navigation'],
    info: 'Navigates to a page',
  },
  scrolling: {
    commands: ['scroll down', 'scroll up', 'scroll to top', 'scroll to bottom'],
    responses: ['Scrolling *'],
    actions: ['scroll'],
    info: 'Scrolls the page',
  },
  openCommands: {
    commands: [
      'open commands',
      'open command list',
      'show commands',
      'show command list',
      'show commands list',
      'open commands list',
    ],
    responses: ['Opening commands list'],
    actions: ['openCommands'],
    info: 'Opens the commands list',
  },
};
