import {
    MdxJsxAttribute,
    MdxJsxAttributeValueExpression,
    MdxJsxExpressionAttribute,
} from 'mdast-util-mdx-jsx'
import React from 'react'
import {
    JsxEditorProps,
    PropertyPopover,
    useMdastNodeUpdater
} from "@mdxeditor/editor";

const isExpressionValue = (value: string | MdxJsxAttributeValueExpression | null | undefined): value is MdxJsxAttributeValueExpression => {
    if (value !== null && typeof value === 'object' && 'type' in value && 'value' in value && typeof value.value === 'string') {
        return true
    }
    return false
}

const isStringValue = (value: string | MdxJsxAttributeValueExpression | null | undefined): value is string => typeof value === 'string'

const isMdxJsxAttribute = (value: MdxJsxAttribute | MdxJsxExpressionAttribute): value is MdxJsxAttribute => {
    if (value.type === 'mdxJsxAttribute' && typeof value.name === 'string') {
        return true
    }
    return false
}

const useMemoProperties = ({mdastNode, descriptor}: JsxEditorProps) => {
    return React.useMemo(
        () =>
            descriptor.props.reduce<Record<string, string>>((acc, {name}) => {
                const attribute = mdastNode.attributes.find((attr) => (isMdxJsxAttribute(attr) ? attr.name === name : false))

                if (attribute) {
                    if (isExpressionValue(attribute.value)) {
                        acc[name] = attribute.value.value
                        return acc
                    }

                    if (isStringValue(attribute.value)) {
                        acc[name] = attribute.value
                        return acc
                    }
                }

                acc[name] = ''
                return acc
            }, {}),
        [mdastNode, descriptor]
    )
}

const genJsxEditorOnChange = (
    {mdastNode, descriptor}: JsxEditorProps
) => {
    const updateMdastNode = useMdastNodeUpdater()
    return React.useCallback(
        (values: Record<string, string>) => {
            const updatedAttributes = Object.entries(values).reduce<typeof mdastNode.attributes>((acc, [name, value]) => {
                if (value === '') {
                    return acc
                }

                const property = descriptor.props.find((prop) => prop.name === name)

                if (property?.type === 'expression') {
                    acc.push({
                        type: 'mdxJsxAttribute',
                        name,
                        value: {type: 'mdxJsxAttributeValueExpression', value}
                    })
                    return acc
                }

                acc.push({
                    type: 'mdxJsxAttribute',
                    name,
                    value
                })

                return acc
            }, [])

            updateMdastNode({attributes: updatedAttributes})
        },
        [mdastNode, updateMdastNode, descriptor]
    )
}


export const CopyGenericJsxEditor = ({mdastNode, descriptor, TargetNode}: {
    TargetNode: React.ComponentType<any>;
} & JsxEditorProps) => {
    const properties = useMemoProperties({mdastNode, descriptor});
    const onChange = genJsxEditorOnChange({mdastNode, descriptor});
    const shouldRenderComponentName = descriptor.props.length == 0 && descriptor.hasChildren && descriptor.kind === 'flow'

    const element = (<TargetNode {...Object.fromEntries(
        Object.entries(properties).map(([key, value]) => [key, value])
    )} />)

    return (
        <div>
            {shouldRenderComponentName ? <span>{mdastNode.name ?? 'Fragment'}</span> : ''}

            {descriptor.props.length > 0 ?
                <PropertyPopover properties={properties} title={mdastNode.name ?? ''} onChange={onChange}/> : null}

            {descriptor.hasChildren
                ? element
                : (<span>{mdastNode.name}</span>)}
        </div>
    )
}