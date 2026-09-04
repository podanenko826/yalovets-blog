'use client';

import dynamic from 'next/dynamic';
import type { EditorProps } from './EditorComponent';

const EditorComponent = dynamic(() => import('./EditorComponent'), { ssr: false });

export default function DynamicEditor(props: EditorProps) {
    return <EditorComponent {...props} />;
}
