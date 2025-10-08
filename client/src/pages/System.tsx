import { Card } from "@/components/ui/card";
import { Users, Archive, VolumeX, Ban, HardDrive, Database } from "lucide-react";

export default function System() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">System Summary</h1>
        <p className="text-muted-foreground">Technical stats and behavioral control center</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Groups Joined</p>
              <p className="text-3xl font-bold font-mono mt-2">14</p>
            </div>
            <div className="rounded-lg bg-chart-1/10 p-3">
              <Users className="h-6 w-6 text-chart-1" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">3 muted</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Archived Chats</p>
              <p className="text-3xl font-bold font-mono mt-2">22</p>
            </div>
            <div className="rounded-lg bg-chart-2/10 p-3">
              <Archive className="h-6 w-6 text-chart-2" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Out of sight</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Blocked Contacts</p>
              <p className="text-3xl font-bold font-mono mt-2">3</p>
            </div>
            <div className="rounded-lg bg-destructive/10 p-3">
              <Ban className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Privacy protected</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-chart-4/10 p-3">
              <HardDrive className="h-6 w-6 text-chart-4" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Storage Usage</h3>
              <p className="text-2xl font-bold font-mono">2.3 GB</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Photos</span>
                <span className="font-mono">1.2 GB</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-chart-2" style={{ width: '52%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Videos</span>
                <span className="font-mono">850 MB</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-chart-3" style={{ width: '37%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Voice Notes</span>
                <span className="font-mono">180 MB</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-chart-1" style={{ width: '8%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Documents</span>
                <span className="font-mono">70 MB</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-chart-5" style={{ width: '3%' }} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-chart-5/10 p-3">
              <Database className="h-6 w-6 text-chart-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Data Usage</h3>
              <p className="text-2xl font-bold font-mono">1.8 GB</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">This month</span>
              <span className="font-mono text-sm">1.8 GB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Last month</span>
              <span className="font-mono text-sm">2.1 GB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Daily average</span>
              <span className="font-mono text-sm">60 MB</span>
            </div>
            <div className="pt-3 border-t">
              <p className="text-sm text-chart-1">↓ 14% reduction from last month</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Storage per Contact (Top 10)</h3>
        <div className="space-y-3">
          {[
            { name: 'Linda', storage: '320 MB', percentage: 85 },
            { name: 'Spencer', storage: '280 MB', percentage: 74 },
            { name: 'Family Group', storage: '250 MB', percentage: 66 },
            { name: 'Glinda', storage: '180 MB', percentage: 48 },
            { name: 'Work Team', storage: '150 MB', percentage: 40 },
            { name: 'Marcus', storage: '120 MB', percentage: 32 },
            { name: 'Sarah', storage: '95 MB', percentage: 25 },
            { name: 'College Friends', storage: '80 MB', percentage: 21 },
            { name: 'David', storage: '65 MB', percentage: 17 },
            { name: 'Emma', storage: '45 MB', percentage: 12 },
          ].map((contact, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{contact.name}</span>
                <span className="font-mono">{contact.storage}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-chart-1 to-chart-4" 
                  style={{ width: `${contact.percentage}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Muted Chats</h3>
          <div className="space-y-3">
            {['Work Announcements', 'Neighborhood Watch', 'Promotions'].map((chat, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                  <span>{chat}</span>
                </div>
                <span className="text-xs text-muted-foreground">Muted</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Chats</span>
              <span className="font-mono font-medium">87</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Unread Messages</span>
              <span className="font-mono font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Starred Messages</span>
              <span className="font-mono font-medium">34</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Broadcast Lists</span>
              <span className="font-mono font-medium">2</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
