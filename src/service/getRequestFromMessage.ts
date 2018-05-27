/**
 * Return informations about a message
 * (Command instance with input parameters)
 * Thanks to https://github.com/Shinobu1337/discord-command-parser/blob/master/src/regexps.js for regular expressions
 */

// Imports
import { Client } from '@root/.'
import { Message } from 'discord.js'
import { CommandRequest, CommandRequestError } from '@root/model/CommandRequest'

// Exports regular expression validators
export const regExpValidators = {
    commandIdentifier: (prefix, names) => new RegExp(`^${prefix}(${names.join('|')}) (.+)?`),
    retrieveArgs: new RegExp(/"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|```((.|\s)*?)```|\S+/g),
    escapeQuotes: new RegExp(/^"|"$|^'|'$|^```(\S*\n?)|```$/g)
}

// Method
export function getRequestFromMessage(
    client: Client,
    message: Message
): CommandRequest {
    const request = new CommandRequest()
    const commandIdentifier = regExpValidators.commandIdentifier(
        client.settings.prefix,
        client.registry.command.getNames()
    )

    // Check if it's a registered command
    if (!commandIdentifier.test(message.content)) {
        request.error = CommandRequestError.NOT_A_COMMAND
        return request
    }

    // Retrieve command name and args list
    const [, cmdName, cmdArgsStr] = message.content.match(commandIdentifier)
    const cmdArgsList = cmdArgsStr
        .match(regExpValidators.retrieveArgs)
        .map(arg => arg.replace(regExpValidators.escapeQuotes, ''))

    // Check if the command exists
    const cmdInstance = client.registry.command.get(cmdName)
    if (cmdInstance === null) {
        request.error = CommandRequestError.UNDEFINED_COMMAND
        return request
    }

    // Check if we have the right arguments
    if (cmdInstance.settings.parameters.length > cmdArgsList.length) {
        request.error = CommandRequestError.NOT_ENOUGH_ARGS
        return request
    }

    // Save and check arguments
    const cmdParameters = {}
    for (let i = 0; i < cmdInstance.settings.parameters.length; i++) {
        const parameter = cmdInstance.settings.parameters[i]
        cmdParameters[parameter.name] = new parameter.type(cmdArgsList[i])
    }

    // Build and return request
    request.command = cmdInstance
    request.parameters = cmdParameters
    return request
}
