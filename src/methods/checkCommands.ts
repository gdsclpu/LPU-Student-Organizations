import { voiceCommandsDataJSON } from 'src/data/voiceCommands';

export interface ICheckCommands {
  commandName: string;
  commandType: string;
  commandAction: string | string[];
}

const checkCommands = (command: string): ICheckCommands => {
  let cmdType: string = '',
    cmdName: string = '';

  for (let cTypeIndex in Object.keys(voiceCommandsDataJSON)) {
    const cType = Object.keys(voiceCommandsDataJSON)[cTypeIndex];
    const commandName: string = (voiceCommandsDataJSON as any)[
      cType
    ].commands.find(
      (cmd: string) =>
        command.toLowerCase().trim().includes(cmd.toLowerCase().trim()) && cmd
    );
    cmdName = commandName;

    if (commandName) {
      cmdType = cType;
      break;
    }
  }
  // console.log({
  //   commandName: cmdName,
  //   commandType: cmdType,
  //   commandAction: (voiceCommandsDataJSON as any)[cmdType]?.actions[0],
  // });

  return {
    commandName: cmdName,
    commandType: cmdType,
    commandAction: (voiceCommandsDataJSON as any)[cmdType]?.actions[0],
  };
};

export default checkCommands;
