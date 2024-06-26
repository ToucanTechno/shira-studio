import { useParams } from "react-router-dom";
import React, {Component} from "react";

/**
 * Wraps a class component with URL params props.
 *
 * @param WrappedComponent - A classname of a React component which tsx can initialize.
 */
function withParams(WrappedComponent: typeof Component<any, any>) {
    return (props: any) => <WrappedComponent {...props} params={useParams()} />;

}
export { withParams };
