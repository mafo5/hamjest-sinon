declare module 'hamjest-sinon' {
    import { Matcher, ValueOrMatcher } from 'hamjest';

    export class SinonMatcher extends Matcher {}

    export function wasCalled(valueOrMatcher?: ValueOrMatcher): Matcher;
    export function wasCalledWith(valueOrMatcher?: ValueOrMatcher): Matcher;
    export function wasCalledInOrder(valueOrMatcher?: ValueOrMatcher): Matcher;
    export function extendHamjest(hamjest?: any): void;

}
