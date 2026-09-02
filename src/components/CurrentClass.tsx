import { Clock3, MapPin, UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ClassPeriod } from "@/types/schedule";

interface CurrentClassProps {
  classItem: ClassPeriod | null;
}

export function CurrentClass({ classItem }: CurrentClassProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border-none shadow-none">
      <CardContent className="p-8 md:p-10">
        <p className="text-sm font-medium text-muted-foreground">
          Current class
        </p>

        {classItem ? (
          <div className="mt-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
                  {classItem.subject}
                </h2>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Clock3 className="size-4" />
                    {classItem.start} – {classItem.end}
                  </span>

                  {classItem.room && (
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="size-4" />
                      {classItem.room}
                    </span>
                  )}

                  {classItem.teacher && (
                    <span className="inline-flex items-center gap-2">
                      <UserRound className="size-4" />
                      {classItem.teacher}
                    </span>
                  )}
                </div>
              </div>

              <span className="mt-1 flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                Now
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <h2 className="text-3xl font-semibold tracking-tight">
              No class right now
            </h2>

            <p className="mt-2 text-muted-foreground">Enjoy the break.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
