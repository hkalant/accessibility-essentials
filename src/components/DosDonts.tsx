import { AE } from '../lib/ae';

export default function DosDonts({ lesson }: { lesson: number }) {
  const { dos, donts } = AE.dosdonts[lesson];
  return (
    <section className="py-10 px-0 border-t border-t-line" id="dos-donts" aria-labelledby="dd-title">
      <h2 className="text-[1.75rem] mb-[.4rem]" id="dd-title">
        Do’s & don’ts
      </h2>
      <p className="mt-0 mx-0 mb-5 text-muted">The habits that make the biggest difference.</p>
      <div className="ae-2col gap-5">
        <div className="flex flex-col gap-[.6rem]">
          <h3 className="font-ui text-[1rem] font-bold flex items-center gap-2 text-ok">
            <span className="w-7 h-7 rounded-[50%] bg-ok text-white grid place-items-center text-[.8rem]" aria-hidden="true">
              <i className="fa-solid fa-check"></i>
            </span>
            Do
          </h3>
          <ul className="list-none m-0 p-0 flex flex-col gap-[.6rem]">
            {dos.map((d: any, i: number) => (
              <li
                key={i}
                className="flex gap-3 items-start bg-surface border border-line border-t-3 border-t-ok rounded-[.875rem] py-[.9rem] px-4 [box-shadow:var(--shadow)]"
              >
                <i className="fa-solid fa-circle-check text-ok mt-1" aria-hidden="true"></i>
                <span>
                  <span className="sr-only">Do: </span>
                  {d}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-[.6rem]">
          <h3 className="font-ui text-[1rem] font-bold flex items-center gap-2 text-bad">
            <span className="w-7 h-7 rounded-[50%] bg-bad text-white grid place-items-center text-[.8rem]" aria-hidden="true">
              <i className="fa-solid fa-xmark"></i>
            </span>
            Don’t
          </h3>
          <ul className="list-none m-0 p-0 flex flex-col gap-[.6rem]">
            {donts.map((d: any, i: number) => (
              <li
                key={i}
                className="flex gap-3 items-start bg-surface border border-line border-t-3 border-t-bad rounded-[.875rem] py-[.9rem] px-4 [box-shadow:var(--shadow)]"
              >
                <i className="fa-solid fa-circle-xmark text-bad mt-1" aria-hidden="true"></i>
                <span>
                  <span className="sr-only">Don’t: </span>
                  {d}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
