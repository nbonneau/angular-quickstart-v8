import { trigger, transition, query, stagger, animate, style } from '@angular/animations';

/**
 * Add [@listAnimation]="items.length" to parent div container list
 * Use (@listAnimation.start)="startAnimationTrigger($event)" or (@listAnimation.done)="doneAnimationTrigger($event)"
 */
export const listAnimation = (duration: number = 500, leaveDuration: number = 500) => {
    return trigger('listAnimation', [
        transition('* => *', [
            query(':leave', [
                stagger(100, [
                    animate(leaveDuration, style({ opacity: 0 }))
                ])
            ], { optional: true }),
            query(':enter', [
                style({ opacity: 0 }),
                stagger(100, [
                    animate(duration, style({ opacity: 1 }))
                ])
            ], { optional: true })
        ])
    ]);
};
