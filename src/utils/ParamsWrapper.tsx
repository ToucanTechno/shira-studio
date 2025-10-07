import { useParams } from "next/navigation";
import React, {Component, ComponentType} from "react";

/**
 * Wraps a class component with URL params props.
 *
 * @param WrappedComponent - A classname of a React component which tsx can initialize.
 */
function withParams<P extends object>(WrappedComponent: ComponentType<P & { params: ReturnType<typeof useParams> }>) {
    return (props: P) => <WrappedComponent {...props} params={useParams()} />;

}
export { withParams };
