import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

export default function BarcodeSvg({
    value,
    className,
}: {
    value: string;
    className?: string;
}) {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current || value.trim() === '') {
            return;
        }

        JsBarcode(svgRef.current, value, {
            format: 'CODE128',
            displayValue: false,
            margin: 0,
            height: 50,
            width: 1.5,
        });
    }, [value]);

    return <svg ref={svgRef} className={className} role="img" aria-label={`Barcode ${value}`} />;
}
