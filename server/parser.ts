import { ParsedMessage } from "@shared/schema";

export class WhatsAppParser {
  private messagePattern = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)\s*[-–]\s*([^:]+):\s*(.*)$/;
  private systemMessagePattern = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)\s*[-–]\s*(.*)$/;

  parse(content: string): ParsedMessage[] {
    const lines = content.split('\n');
    const messages: ParsedMessage[] = [];
    let currentMessage: ParsedMessage | null = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      const messageMatch = trimmedLine.match(this.messagePattern);
      
      if (messageMatch) {
        if (currentMessage) {
          messages.push(currentMessage);
        }

        const [, date, time, sender, content] = messageMatch;
        const timestamp = this.parseTimestamp(date, time);
        const messageType = this.detectMessageType(content);

        currentMessage = {
          timestamp,
          sender: sender.trim(),
          content: content.trim(),
          type: messageType.type,
          mediaType: messageType.mediaType,
          isDeleted: content.includes('This message was deleted') || content.includes('You deleted this message'),
        };
      } else {
        const systemMatch = trimmedLine.match(this.systemMessagePattern);
        if (systemMatch) {
          if (currentMessage) {
            messages.push(currentMessage);
          }

          const [, date, time, content] = systemMatch;
          const timestamp = this.parseTimestamp(date, time);

          currentMessage = {
            timestamp,
            sender: 'System',
            content: content.trim(),
            type: 'system',
          };
        } else if (currentMessage) {
          currentMessage.content += '\n' + trimmedLine;
        }
      }
    }

    if (currentMessage) {
      messages.push(currentMessage);
    }

    return messages;
  }

  private parseTimestamp(dateStr: string, timeStr: string): Date {
    const [month, day, year] = dateStr.split('/').map(Number);
    const fullYear = year < 100 ? 2000 + year : year;
    
    let hours: number, minutes: number;
    
    if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
      const isPM = timeStr.toLowerCase().includes('pm');
      const cleanTime = timeStr.replace(/[AaPpMm\s]/g, '');
      const [h, m] = cleanTime.split(':').map(Number);
      hours = isPM && h !== 12 ? h + 12 : !isPM && h === 12 ? 0 : h;
      minutes = m;
    } else {
      const [h, m] = timeStr.split(':').map(Number);
      hours = h;
      minutes = m;
    }

    return new Date(fullYear, month - 1, day, hours, minutes);
  }

  private detectMessageType(content: string): { type: ParsedMessage['type']; mediaType?: ParsedMessage['mediaType'] } {
    const lowerContent = content.toLowerCase();

    if (lowerContent.includes('<attached:') || lowerContent.includes('image omitted') || lowerContent.includes('photo omitted')) {
      return { type: 'media', mediaType: 'photo' };
    }
    if (lowerContent.includes('video omitted') || lowerContent.includes('.mp4')) {
      return { type: 'media', mediaType: 'video' };
    }
    if (lowerContent.includes('audio omitted') || lowerContent.includes('voice message') || lowerContent.includes('ptt')) {
      return { type: 'voice', mediaType: 'voice' };
    }
    if (lowerContent.includes('document omitted') || lowerContent.includes('.pdf') || lowerContent.includes('.docx')) {
      return { type: 'media', mediaType: 'document' };
    }
    if (lowerContent.includes('missed voice call') || lowerContent.includes('missed video call') || lowerContent.includes('voice call') || lowerContent.includes('video call')) {
      return { type: 'call' };
    }

    return { type: 'text' };
  }
}
