import React from "react";
import type { CmsWidgetControlProps } from "netlify-cms-core";

function assertDefined<T>(v: T | null | undefined): T {
  console.assert(v !== undefined, "Expected value, was undefined");
  console.assert(v !== null, "Expected value, was null");
  return v as T;
}

type RealControlProps = CmsWidgetControlProps<string> & {
  entry: ReadonlyMap<string, any>;
};

export type WidgetInstanceMeta = {
  field: RealControlProps["field"];
  entry: ReadonlyMap<string, any>;
};

function createExternalImageWidget(
  uploadCallback: (file: File, meta: WidgetInstanceMeta) => Promise<string>,
  getPreviewUrl: (storedValue: string, meta: WidgetInstanceMeta) => string
): React.ComponentClass<CmsWidgetControlProps> {
  return class ExternalImage extends React.Component<
    RealControlProps,
    { preview: undefined | File; saving: boolean }
  > {
    inputRef: React.RefObject<HTMLInputElement>;
    constructor(props: RealControlProps) {
      super(props);
      this.state = { preview: undefined, saving: false };
      this.handleFileSelect = this.handleFileSelect.bind(this);
      this.handleSave = this.handleSave.bind(this);
      this.handleUploadDone = this.handleUploadDone.bind(this);
      this.inputRef = React.createRef();
    }
    handleFileSelect() {
      this.setState({ preview: this.inputRef.current?.files?.[0] });
    }
    handleSave() {
      this.setState({ saving: true });

      uploadCallback(assertDefined(this.state.preview), {
        field: this.props.field,
        entry: this.props.entry,
      }).then(this.handleUploadDone);
    }
    handleUploadDone(v: string) {
      this.setState({ saving: false, preview: undefined });
      this.props.onChange(v);
      assertDefined(this.inputRef?.current).value = "";
    }
    render() {
      console.log(this);
      return (
        <div className={this.props.classNameWrapper}>
          {this.props.value ? (
            <>
              Current image:
              <img
                src={getPreviewUrl(this.props.value, {
                  field: this.props.field,
                  entry: this.props.entry,
                })}
              />
              Replace:
            </>
          ) : (
            "Upload image:"
          )}
          <input
            type="file"
            accept="image/png, image/jpeg, image/gif"
            onChange={this.handleFileSelect}
            disabled={this.state.saving}
            ref={this.inputRef}
          />
          {this.state.preview !== undefined && (
            <>
              Preview: <img src={URL.createObjectURL(this.state.preview)} />
              <button onClick={this.handleSave} disabled={this.state.saving}>
                {this.state.saving ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>
      );
    }
  } as unknown as React.ComponentClass<CmsWidgetControlProps>;
}
export default createExternalImageWidget;
