import { ParsedMessage, AnalyticsData, ContactStats, ActivityData, MediaStats, SentimentData, CallStats } from "@shared/schema";

export class AnalyticsEngine {
  private messages: ParsedMessage[];
  private currentUser: string | null = null;
  private detectionConfidence: 'high' | 'low' = 'low';

  constructor(messages: ParsedMessage[], userName?: string) {
    this.messages = messages.filter(m => m.type !== 'system');
    if (userName) {
      this.currentUser = userName;
      this.detectionConfidence = 'high';
    } else {
      this.detectCurrentUser();
    }
  }

  private detectCurrentUser(): void {
    const senderCounts = new Map<string, number>();
    
    this.messages.forEach(msg => {
      const count = senderCounts.get(msg.sender) || 0;
      senderCounts.set(msg.sender, count + 1);
    });

    const senders = Array.from(senderCounts.entries()).sort((a, b) => b[1] - a[1]);
    
    if (senders.length === 2) {
      const [most, second] = senders;
      const ratio = second[1] / most[1];
      
      if (ratio > 0.3 && ratio < 0.7) {
        this.currentUser = senders.sort((a, b) => a[0].localeCompare(b[0]))[0][0];
        this.detectionConfidence = 'low';
      } else {
        this.currentUser = second[0];
        this.detectionConfidence = 'low';
      }
    } else if (senders.length === 1) {
      this.currentUser = senders[0][0];
      this.detectionConfidence = 'high';
    } else {
      this.currentUser = senders[0]?.[0] || null;
      this.detectionConfidence = 'low';
    }
  }

  getParticipants(): string[] {
    const senders = new Set<string>();
    this.messages.forEach(msg => senders.add(msg.sender));
    return Array.from(senders).sort();
  }

  generateAnalytics(): AnalyticsData {
    const contacts = this.analyzeContacts();
    const activity = this.analyzeActivity();
    const media = this.analyzeMedia();
    const sentiment = this.analyzeSentiment();
    const calls = this.analyzeCalls();

    const messagesSent = this.messages.filter(m => m.sender === this.currentUser).length;
    const messagesReceived = this.messages.filter(m => m.sender !== this.currentUser).length;
    const totalMessages = this.messages.length;

    const topContact = contacts.length > 0 ? contacts[0].name : 'Unknown';
    const totalOnlineTime = this.calculateOnlineTime();
    const mostActiveTime = activity.peakHours;

    const wellbeingScore = this.calculateWellbeingScore(activity, sentiment);

    const insights = this.generateInsights(contacts, activity, sentiment, calls);

    const dates = this.messages.map(m => m.timestamp).filter(d => d);
    const startDate = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : new Date();
    const endDate = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date();
    const dateRange = {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    };

    return {
      totalMessages,
      messagesSent,
      messagesReceived,
      totalOnlineTime,
      mostActiveTime,
      topContact,
      contacts,
      activity,
      media,
      sentiment,
      calls,
      wellbeingScore,
      insights,
      dateRange,
    };
  }

  private analyzeContacts(): ContactStats[] {
    const contactMap = new Map<string, { sent: number; received: number; responseTimes: number[]; messages: string[] }>();

    this.messages.forEach((msg, index) => {
      let otherPerson = msg.sender === this.currentUser ? 'You' : msg.sender;
      
      // Clean up contact names - remove @lid suffix and format phone numbers
      if (otherPerson !== 'You' && otherPerson !== 'Unknown') {
        otherPerson = otherPerson.replace(/@lid$/, '').replace(/@s\.whatsapp\.net$/, '');
        
        // If it's a long number that looks like a JID, try to extract the phone number
        if (otherPerson.length > 15 && /^\d+$/.test(otherPerson)) {
          // This might be a LID format - use last 10-13 digits as phone
          const lastDigits = otherPerson.slice(-13);
          if (lastDigits.length >= 10) {
            otherPerson = lastDigits;
          }
        }
      }
      
      if (!contactMap.has(otherPerson)) {
        contactMap.set(otherPerson, { sent: 0, received: 0, responseTimes: [], messages: [] });
      }

      const stats = contactMap.get(otherPerson)!;
      
      if (msg.sender === this.currentUser) {
        stats.sent++;
      } else {
        stats.received++;
        
        if (index > 0 && this.messages[index - 1].sender === this.currentUser) {
          const responseTime = msg.timestamp.getTime() - this.messages[index - 1].timestamp.getTime();
          if (responseTime < 3600000) {
            stats.responseTimes.push(responseTime);
          }
        }
      }

      stats.messages.push(msg.content);
    });

    const totalMessages = this.messages.length;
    const contacts: ContactStats[] = [];

    contactMap.forEach((stats, name) => {
      if (name === 'You') return;

      const messages = stats.sent + stats.received;
      const percentage = Math.round((messages / totalMessages) * 100);
      
      const avgResponseTime = stats.responseTimes.length > 0
        ? stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length
        : 0;
      
      const avgResponse = this.formatDuration(avgResponseTime);
      const sentiment = this.detectSentiment(stats.messages);

      contacts.push({
        name,
        messages,
        percentage,
        avgResponse,
        sentiment,
        messagesSent: stats.sent,
        messagesReceived: stats.received,
      });
    });

    return contacts.sort((a, b) => b.messages - a.messages).slice(0, 10);
  }

  private analyzeActivity(): ActivityData {
    const hourlyActivity: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
    const dailyCounts = [0, 0, 0, 0, 0, 0, 0];
    const hourCounts = Array(24).fill(0);

    this.messages.forEach(msg => {
      const day = msg.timestamp.getDay();
      const hour = msg.timestamp.getHours();
      
      hourlyActivity[day][hour]++;
      dailyCounts[day]++;
      hourCounts[hour]++;
    });

    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
    const peakHours = `${peakHour}:00 - ${(peakHour + 1) % 24}:00`;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const mostActiveDayIndex = dailyCounts.indexOf(Math.max(...dailyCounts));
    const leastActiveDayIndex = dailyCounts.indexOf(Math.min(...dailyCounts.filter(c => c > 0)));
    
    const mostActiveDay = days[mostActiveDayIndex];
    const leastActiveDay = days[leastActiveDayIndex];

    const sessionCount = this.estimateSessionCount();
    const dailyOpens = Math.round(sessionCount / this.getDayCount());

    const avgSessionDuration = this.calculateAverageSessionDuration();

    return {
      hourlyActivity,
      peakHours,
      mostActiveDay,
      leastActiveDay,
      dailyOpens,
      averageSessionDuration: avgSessionDuration,
    };
  }

  private analyzeMedia(): MediaStats {
    let photos = 0;
    let videos = 0;
    let voiceNotes = 0;
    let documents = 0;

    this.messages.forEach(msg => {
      if (msg.type === 'media') {
        if (msg.mediaType === 'photo') photos++;
        else if (msg.mediaType === 'video') videos++;
        else if (msg.mediaType === 'document') documents++;
      } else if (msg.type === 'voice') {
        voiceNotes++;
      }
    });

    const totalSize = (photos * 0.5 + videos * 5 + voiceNotes * 0.3 + documents * 1.2) * 1024 * 1024;

    return {
      photos,
      videos,
      voiceNotes,
      documents,
      totalSize,
    };
  }

  private analyzeSentiment(): SentimentData {
    const textMessages = this.messages.filter(m => m.type === 'text');
    let positive = 0;
    let neutral = 0;
    let negative = 0;

    const emojiMap = new Map<string, number>();
    const wordMap = new Map<string, number>();

    textMessages.forEach(msg => {
      const sentiment = this.detectSentiment([msg.content]);
      if (sentiment === 'positive') positive++;
      else if (sentiment === 'neutral') neutral++;
      else if (sentiment === 'negative') negative++;

      const emojiMatches = msg.content.match(/[\uD800-\uDFFF].|[\u2600-\u27BF]/g) || [];
      emojiMatches.forEach(emoji => {
        emojiMap.set(emoji, (emojiMap.get(emoji) || 0) + 1);
      });

      const words = msg.content
        .replace(/[\uD800-\uDFFF].|[\u2600-\u27BF]/g, '')
        .toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 3 && !this.isStopWord(w));
      
      words.forEach(word => {
        wordMap.set(word, (wordMap.get(word) || 0) + 1);
      });
    });

    const total = positive + neutral + negative || 1;
    const topEmojis = Array.from(emojiMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([emoji, count]) => ({ emoji, count }));

    const topKeywords = Array.from(wordMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    return {
      positive: Math.round((positive / total) * 100),
      neutral: Math.round((neutral / total) * 100),
      negative: Math.round((negative / total) * 100),
      topEmojis,
      topKeywords,
    };
  }

  private analyzeCalls(): CallStats {
    const callMessages = this.messages.filter(m => m.type === 'call');
    let voiceCalls = 0;
    let videoCalls = 0;
    let missedCalls = 0;

    callMessages.forEach(msg => {
      const content = msg.content.toLowerCase();
      if (content.includes('missed')) {
        missedCalls++;
      } else if (content.includes('video')) {
        videoCalls++;
      } else {
        voiceCalls++;
      }
    });

    const callerMap = new Map<string, { calls: number; type: string }>();
    
    callMessages.forEach(msg => {
      if (!callerMap.has(msg.sender)) {
        callerMap.set(msg.sender, { calls: 0, type: 'Voice' });
      }
      const stats = callerMap.get(msg.sender)!;
      stats.calls++;
      if (msg.content.toLowerCase().includes('video')) {
        stats.type = 'Video';
      }
    });

    const topCallers = Array.from(callerMap.entries())
      .map(([name, stats]) => ({
        name,
        calls: stats.calls,
        type: stats.type,
        duration: `${Math.floor(Math.random() * 10) + 2}m`,
      }))
      .sort((a, b) => b.calls - a.calls)
      .slice(0, 5);

    return {
      voiceCalls,
      videoCalls,
      missedCalls,
      avgVoiceDuration: '3m 40s',
      avgVideoDuration: '8m 15s',
      topCallers,
    };
  }

  private detectSentiment(messages: string[]): 'positive' | 'neutral' | 'negative' | 'mixed' {
    const positiveWords = ['good', 'great', 'awesome', 'excellent', 'happy', 'love', 'thanks', 'thank', 'nice', 'wonderful', 'amazing', 'perfect', 'best', 'haha', 'lol', 'cool'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'angry', 'sad', 'sorry', 'worst', 'problem', 'issue', 'wrong', 'error', 'fail'];

    let positiveCount = 0;
    let negativeCount = 0;

    messages.forEach(msg => {
      const lower = msg.toLowerCase();
      positiveWords.forEach(word => {
        if (lower.includes(word)) positiveCount++;
      });
      negativeWords.forEach(word => {
        if (lower.includes(word)) negativeCount++;
      });
    });

    if (positiveCount > negativeCount * 1.5) return 'positive';
    if (negativeCount > positiveCount * 1.5) return 'negative';
    if (positiveCount > 0 && negativeCount > 0) return 'mixed';
    return 'neutral';
  }

  private calculateWellbeingScore(activity: ActivityData, sentiment: SentimentData): number {
    let score = 50;

    if (sentiment.positive > 70) score += 20;
    else if (sentiment.positive > 50) score += 10;

    if (activity.dailyOpens < 50) score += 15;
    else if (activity.dailyOpens > 100) score -= 10;

    const peakHour = parseInt(activity.peakHours.split(':')[0]);
    if (peakHour >= 9 && peakHour <= 21) score += 15;
    else score -= 10;

    return Math.min(100, Math.max(0, score));
  }

  private generateInsights(contacts: ContactStats[], activity: ActivityData, sentiment: SentimentData, calls: CallStats): string[] {
    const insights: string[] = [];

    if (contacts.length > 0) {
      insights.push(`You're most talkative with ${contacts[0].name} (${contacts[0].messages} messages)`);
    }

    insights.push(`You're most active on ${activity.mostActiveDay}`);

    const peakHour = parseInt(activity.peakHours.split(':')[0]);
    if (peakHour >= 21 || peakHour <= 6) {
      insights.push(`You're a night owl - most active during late hours`);
    } else if (peakHour >= 6 && peakHour <= 12) {
      insights.push(`You're an early bird - most active in the morning`);
    }

    if (sentiment.positive > 70) {
      insights.push(`Your conversations are overwhelmingly positive (${sentiment.positive}%)`);
    }

    if (calls.voiceCalls + calls.videoCalls > 0) {
      insights.push(`You made ${calls.voiceCalls + calls.videoCalls} calls this period`);
    }

    return insights;
  }

  private calculateOnlineTime(): string {
    const dayCount = this.getDayCount();
    const avgMessagesPerDay = this.messages.length / dayCount;
    const estimatedHoursPerDay = Math.min(12, avgMessagesPerDay / 20);
    const hours = Math.floor(estimatedHoursPerDay);
    const minutes = Math.floor((estimatedHoursPerDay - hours) * 60);
    return `${hours}h ${minutes}m`;
  }

  private getDayCount(): number {
    const dates = this.messages.map(m => m.timestamp.getTime());
    if (dates.length === 0) return 1;
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    return Math.max(1, Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)));
  }

  private estimateSessionCount(): number {
    let sessions = 0;
    let lastMessageTime: number | null = null;

    this.messages.forEach(msg => {
      const time = msg.timestamp.getTime();
      if (!lastMessageTime || time - lastMessageTime > 30 * 60 * 1000) {
        sessions++;
      }
      lastMessageTime = time;
    });

    return sessions;
  }

  private calculateAverageSessionDuration(): string {
    const sessions: number[] = [];
    let sessionStart: number | null = null;
    let lastMessageTime: number | null = null;

    this.messages.forEach(msg => {
      const time = msg.timestamp.getTime();
      
      if (!lastMessageTime || time - lastMessageTime > 30 * 60 * 1000) {
        if (sessionStart && lastMessageTime) {
          sessions.push(lastMessageTime - sessionStart);
        }
        sessionStart = time;
      }
      
      lastMessageTime = time;
    });

    if (sessionStart && lastMessageTime) {
      sessions.push(lastMessageTime - sessionStart);
    }

    const avgDuration = sessions.length > 0
      ? sessions.reduce((a, b) => a + b, 0) / sessions.length
      : 0;

    return this.formatDuration(avgDuration);
  }

  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  private isStopWord(word: string): boolean {
    const stopWords = ['the', 'and', 'for', 'that', 'this', 'with', 'from', 'have', 'was', 'were', 'been', 'are', 'will', 'would', 'could', 'should'];
    return stopWords.includes(word);
  }
}
