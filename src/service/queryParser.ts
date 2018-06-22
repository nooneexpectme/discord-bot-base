/**
 * Return informations about a message
 * (Command instance with input parameters)
 * Thanks to https://github.com/Shinobu1337/discord-command-parser/blob/master/src/regexps.js for regular expressions
 */

// Imports
import { Client } from '../'
import { Message } from 'discord.js'
import { CommandRequest, CommandRequestError } from '../model/CommandRequest'

// Exports regular expression validators
export const regExpValidators = {
    commandIdentifier: (prefix, names) => new RegExp(`^${prefix}(${names.join('|')})\s?(.+)?`),
    retrieveArgs: new RegExp(/"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|```((.|\s)*?)```|\S+/g),
    escapeQuotes: new RegExp(/^"|"$|^'|'$|^```(\S*\n?)|```$/g)
}

// Method
export async function queryParser(
    client: Client,
    message: Message
): Promise<CommandRequest> {
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
        const optionalArgs = cmdInstance.settings.args.filter(arg => arg.isOptional)
        const argNbs = cmdInstance.settings.args.length
        const requiredArgsNb = argNbs - optionalArgs.length

        if (requiredArgsNb > reqArgsList.length) {
            request.error = CommandRequestError.NOT_ENOUGH_ARGS
        } else {
            // Save and check args
            for (let i = 0; i < argNbs; i++) {
                const arg = cmdInstance.settings.args[i]
                const typedArg = await arg.type.bind(client)(reqArgsList[i] || arg.default)
                if (arg.validator) {
                    const [isSuccess, errorMsg] = await arg.validator.bind(client)(typedArg)
                    if (!isSuccess) {
                        request.error = CommandRequestError.INVALID_ARG
                        request.validatorError = errorMsg
                        break
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
