"use client"

import { X, Euro, Clock, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SwapMealModalProps {
  onClose: () => void
}

export default function SwapMealModal({ onClose }: SwapMealModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-card w-full rounded-t-2xl p-6 space-y-6 max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Swap This Meal</h2>
            <p className="text-sm text-muted-foreground mt-1">What kind of alternative are you looking for?</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={24} className="text-foreground" />
          </button>
        </div>

        {/* Swap Options */}
        <div className="space-y-3">
          {/* Cheaper Meal */}
          <button className="w-full bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-4 text-left hover:border-primary/50 transition-colors group">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <Euro size={20} className="text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Find Cheaper Meal</h3>
                <p className="text-sm text-muted-foreground">Save up to €0.50</p>
              </div>
            </div>
          </button>

          {/* Faster Meal */}
          <button className="w-full bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 rounded-lg p-4 text-left hover:border-accent/50 transition-colors group">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/20 group-hover:bg-accent/30 transition-colors">
                  <Clock size={20} className="text-accent" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Find Faster Meal</h3>
                <p className="text-sm text-muted-foreground">Ready in 20 minutes</p>
              </div>
            </div>
          </button>

          {/* Boost Nutrient */}
          <button className="w-full bg-gradient-to-r from-green-500/20 to-green-500/10 border border-green-500/30 rounded-lg p-4 text-left hover:border-green-500/50 transition-colors group">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                  <Leaf size={20} className="text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Boost My Target</h3>
                <p className="text-sm text-muted-foreground">More Magnesium</p>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="flex gap-2 pt-4">
          <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
