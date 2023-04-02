import {Message} from "../types/message.type";

const messages: Message[] = []

export class DashboardMessageRepository {
    public create(message: Message): void {
        messages.push(message)
    }

    public listMessages(): Message[] {
        return messages
    }
}