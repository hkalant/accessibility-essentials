// MathML elements used for the accessible-maths example in Lesson 5.
import 'react';

type MathProps = React.HTMLAttributes<HTMLElement> & { display?: string; xmlns?: string };

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      math: MathProps;
      mrow: MathProps;
      mi: MathProps;
      mn: MathProps;
      mo: MathProps;
      mfrac: MathProps;
      msqrt: MathProps;
      msup: MathProps;
      msub: MathProps;
    }
  }
}
