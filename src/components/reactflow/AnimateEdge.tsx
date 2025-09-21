import { BaseEdge, type EdgeProps, getSimpleBezierPath } from '@xyflow/react';
import { useReactFlow } from '@xyflow/react';
import { useRef, useEffect, useCallback } from 'react';

export function AnimatedEdge({ id,  sourceX,  sourceY,  targetX,  targetY,  sourcePosition,  targetPosition,  data,}: EdgeProps) {
    const [edgePath] = getSimpleBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition,});

    const { setEdges } = useReactFlow();
    const animRef = useRef<SVGAnimateMotionElement>(null);


    const handleEnd = useCallback(() => {
        console.log('Animation ended for edge', id);
        setEdges((edges) =>
        edges.map((edge) =>
            edge.id === id
            ? { ...edge, data: { ...edge.data, play: false } }
            : edge
        )
        );
    }, [id, setEdges]);


    useEffect(() => {
        const anim = animRef.current;
        if (!anim) return;

        anim.addEventListener('endEvent', handleEnd);
        return () => anim.removeEventListener('endEvent', handleEnd);
    }, [handleEnd]);


    useEffect(() => {
        if (data?.play) {
            animRef.current?.beginElement();
            setTimeout(() => handleEnd(), 670)
        }
    }, [data?.play]);

    return (
        <>
        <BaseEdge id={`edge-path-${id}`} path={edgePath} />
        {data?.play ? 
           <text
                style={{ visibility: data?.play ? 'visible' : 'hidden' }}
                fontSize={16}
                fontWeight="bold"
                fill="#ff0073"
                textAnchor="middle"
                dominantBaseline="middle"
                >
                💰
                    <animateMotion
                        ref={animRef}
                        dur="0.7s"
                        repeatCount={1}
                        begin="indefinite"
                    >
                        <mpath xlinkHref={`#edge-path-${id}`} />
                    </animateMotion>
                </text> : null
        }
        </>
    );
}
