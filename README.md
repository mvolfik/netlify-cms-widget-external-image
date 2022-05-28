# netlify-cms-widget-external-image

Image widget for Netlify CMS: upload image to an external server and store just an identifier

## Usage

```js
import CMS from "netlify-cms-app";
import ExternalImage from "netlify-cms-widget-external-image";

CMS.registerWidget(
  "external-image",
  ExternalImage(
    async (f) => {
      /* upload ... */ return assetId;
    },
    (assetId) => `https://myassetserver.com/asset/${assetId}`
  )
);
CMS.init();
```

## API

### `export type WidgetInstanceMeta`

```ts
export declare type WidgetInstanceMeta = {
  field: ReadonlyMap<string, any>;
  entry: ReadonlyMap<string, any>;
};
```

Object containing available metadata. `field` contains config for the given field from CMS `config.yml`, `entry` contains data about the current item that is being edited (namely values of other fields, `slug`, `raw`...)

### (`export default`) `function createExternalImageWidget(...)`

```ts
declare function createExternalImageWidget(
  uploadCallback: (file: File, meta: WidgetInstanceMeta) => Promise<string>,
  getPreviewUrl: (storedValue: string, meta: WidgetInstanceMeta) => string
): React.ComponentClass<CmsWidgetControlProps>;
export default createExternalImageWidget;
```

Factory function for a component class that you can provide to `CMS.registerWidget`.

`uploadCallback` is called when user chooses to upload a new image (including replacing the previous one). You should store the image (`File` is a subclass of `Blob`) and return a `string` that identifies the file (that will be stored in the content)

`getPreviewUrl` takes the value as returned by the callback and must return a URL (as a `string`) of a suitable preview

Both functions can make use of the available metadata (see above).
