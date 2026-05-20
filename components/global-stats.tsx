import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Global stats require authenticated access to Buckler ranking pages.
// Fetching and caching this data will be implemented in the next iteration.
export function GlobalStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-zinc-400 uppercase tracking-wider">Character Popularity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-600 text-sm">Coming soon — search for a player to get started</p>
        </CardContent>
      </Card>
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-zinc-400 uppercase tracking-wider">Rank Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-600 text-sm">Coming soon</p>
        </CardContent>
      </Card>
    </div>
  )
}
