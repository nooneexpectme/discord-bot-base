/**
 * Return informations about a message
 * (Command instance with input parameters)
 * Thanks to https://github.com/Shinobu1337/discord-command-parser/blob/master/src/regexps.js for regular expressions
 */

// Imports
import { Client } from '@root/index'
import { Message } from 'discord.js'
import { CommandRequest, CommandRequestError } from '@root/model/CommandRequest'

// Exports regular expression validators
export const regExpValidators = {
    commandIdentifier: (prefix, names) => new RegExp(`^${prefix}(${names.join('|')}) (.+)?`),
    retrieveArgs: new RegExp(/"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|```((.|\s)*?)```|\S+/g),
    escapeQuotes: new RegExp(/^"|"$|^'|'$|^```(\S*\n?)|```$/g)
}

// Method
export function queryParser(
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
    const [, reqCommand, reqArgs] = message.content.match(commandIdentifier)
    const reqArgsList = reqArgs
        .match(regExpValidators.retrieveArgs)
        .map(arg => arg.replace(regExpValidators.escapeQuotes, ''))

    // Check if the command exists
    const cmdInstance = client.registry.command.get(reqCommand)
    if (cmdInstance === null) {
        request.error = CommandRequestError.UNDEFINED_COMMAND
        return request
    }

    // Retrieve parameters
    const cmdArgs = { requestContent: reqArgs }
    if (Array.isArray(cmdInstance.settings.args)) {
        // Check if we have enough args
        if (cmdInstance.settings.args.length > reqArgsList.length) {
            request.error = CommandRequestError.NOT_ENOUGH_ARGS
            return request
        }

        // Save and check args
        for (let i = 0; i < cmdInstance.settings.args.length; i++) {
            const arg = cmdInstance.settings.args[i]
            cmdArgs[arg.name] = new arg.type(reqArgsList[i])
        }
    }

    // Update and return request
    request.command = cmdInstance
    request.args = cmdArgs
    return request
}
