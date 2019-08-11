import { style, trigger, transition, animate } from '@angular/animations';

/**
 * Add [@slide*] to element to animate
 */
export const slideAnimation = (from: string = 'top', duration: number = 200, fade: boolean = true) => {

    let transformFrom = 'translateY(-100%)';
    let transformTo = 'translateY(0%)';

    switch (from) {
        case 'right':
            transformFrom = 'translateX(100%)';
            transformTo = 'translateX(0%)';
            break;
        case 'bottom':
            transformFrom = 'translateY(100%)';
            break;
        case 'left':
            transformFrom = 'translateX(-100%)';
            transformTo = 'translateX(0%)';
            break;
        default:
            from = 'top';
            break;
    }
    return trigger('slide' + ucFirst(from), [
        transition(':enter', [
            style({ transform: transformFrom, opacity: fade ? 0 : 1 }),
            animate(duration + 'ms ease-in', style({ transform: transformTo, opacity: 1 }))
        ]),
        transition(':leave', [
            animate(duration + 'ms ease-in', style({ transform: transformFrom, opacity: fade ? 0 : 1 }))
        ])
    ]);
};

function ucFirst(str) {
    return str.length > 0 ? str[0].toUpperCase() + str.substring(1) : str;
}
