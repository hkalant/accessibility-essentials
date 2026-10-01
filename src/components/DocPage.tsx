import type { ReactNode } from 'react';

// Flowing printable document: a white sheet on a grey desk on screen; at print the
// browser paginates the content onto the user's own paper with the given margin.
export default function DocPage({ margin = '0.75in', children }: { margin?: string; children: ReactNode }) {
  return (
    <div className="doc-desk min-h-screen min-w-max bg-[#f5f5f4] px-6 py-12 print:min-h-0 print:min-w-0 print:bg-transparent print:p-0">
      <style>{`@page { margin: ${margin}; }`}</style>
      <div
        className="doc-sheet mx-auto w-[8.5in] rounded-[7px] bg-white [box-shadow:0_2px_10px_rgba(20,20,19,.12)] print:w-auto print:rounded-none print:p-0! print:[box-shadow:none]"
        style={{ padding: margin }}
      >
        {children}
      </div>
    </div>
  );
}
