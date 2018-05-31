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
    commandIdentifier: (prefix, names) => new RegExp(`^${prefix}(${names.join('|')})\s?(.+)?`),
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
        request.error = CommandRequestError.UNDEFINED_COMMAND
        return request
    }

    // Retrieve command name and args list
    const [, reqCommand, reqArgs] = message.content.match(commandIdentifier)
    const reqArgsList = reqArgs === undefined ? [] : reqArgs
        .match(regExpValidators.retrieveArgs)
        .map(arg => arg.replace(regExpValidators.escapeQuotes, ''))

    // Check if the command exists
    const cmdInstance = client.registry.command.get(reqCommand)
    if (cmdInstance === null) {
        request.error = CommandRequestError.UNDEFINED_COMMAND
        return request
    }

    // Setting: OwnerOnly
    if (cmdInstance.settings.ownerOnly && message.author.id !== client.settings.ownerId) {
        request.error = CommandRequestError.NOT_ALLOWED
        return request
    }

    // Retrieve parameters
    const cmdArgs = { requestContent: reqArgs }
    if (Array.isArray(cmdInstance.settings.args)) {
        // Check if we have enough args
        if (cmdInstance.settings.args.length > reqArgsList.length) {
            request.error = CommandRequestError.NOT_ENOUGH_ARGS
        } else {
            // Save and check args
            for (let i = 0; i < cmdInstance.settings.args.length; i++) {
                const arg = cmdInstance.settings.args[i]
                const typedArg = new arg.type(reqArgsList[i])
                if (arg.validator) {
                    const [isSuccess, errorMsg] = arg.validator(typedArg)
                    if (isSuccess) {
                        request.error = CommandRequestError.INVALID_ARG
                        request.validatorError = errorMsg
                        return request
                    }
                }
                cmdArgs[arg.name] = typedArg
            }
        }
    }

    // Update and return request
    request.command = cmdInstance
    request.args = cmdArgs
    return request
}
