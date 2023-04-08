import {Message} from "../types/message.type";

const messages: Message[] = []

/**
 * Dashboard message repository to get dashboard messages
 */
export class DashboardMessageRepository {
    public create(message: Message): void {
        messages.push(message)
    }

    public listMessages(): Message[] {
        return messages
    }
}