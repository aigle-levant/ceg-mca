import { ArrowRight, Clock3, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ClassPeriod } from "@/types/schedule";

interface UpcomingClassProps {
  classItem: ClassPeriod | null;
}

export function UpcomingClass({ classItem }: UpcomingClassProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border-none shadow-none">
      <CardContent className="p-8 md:p-10">
        <p className="text-sm font-medium text-muted-foreground">
          Upcoming class
        </p>

        {classItem ? (
          <div className="mt-8 flex items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {classItem.subject}
              </h2>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
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
              </div>
            </div>

            <ArrowRight className="hidden size-6 text-muted-foreground md:block" />
          </div>
        ) : (
          <div className="mt-8">
            <h2 className="text-3xl font-semibold tracking-tight">
              No more classes
            </h2>

            <p className="mt-2 text-muted-foreground">That's it for today.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
