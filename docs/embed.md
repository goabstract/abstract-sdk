---
id: embed
title: Embeds
---

Embeds can be used to display interactive, up-to-date previews for layers and collections in any environment that supports HTML. To use an embed, create an `<iframe>` with a special URL derived from public share URLs.

> Note: Only links for publicly-shared layers or collections can be embedded at this time.

## Generating an embed

<div id="embed-gen">
  <input id="embed-input" type="text" placeholder="Paste a public share link, e.g. https://share.goabstract.com/..." />
  <div id="embed" class="button" >EMBED</div>
  <div id="waiting">Waiting for share link...</div>
  <div id="copy" class="button" >COPY</div>
  <script>
    (() => {
      const container = document.querySelector('#embed-gen');
      const copy = document.querySelector('#copy');
      const input = document.querySelector('#embed-input');
      const waiting = document.querySelector('#waiting');
      function generateCode() {
        container.classList.remove('done');
        copy.classList.remove('copied');
        const urlDiv = document.querySelector('#embed-gen + pre > code > .hljs-tag:first-child > .hljs-string:nth-child(3)');
        const shareId = input.value.match(/\/[\w\d-]+$/);
        if (!shareId) {
          waiting.innerHTML = 'Invalid share link. Please try again...';
          return;
        }
        const embedUrl = `https://app.goabstract.com/embed${shareId}`;
        urlDiv.innerHTML = `"${embedUrl}"`;
        container.classList.add('done');
      }
      function copyCode() {
        const code = document.querySelector('#embed-gen + pre > code');
        const textarea = document.createElement('textarea');
        textarea.classList.add('hidden');
        document.body.appendChild(textarea);
        textarea.value = code.innerText;
        textarea.select();
        document.execCommand('copy');
        textarea.parentElement.removeChild(textarea);
        copy.classList.add('copied');
        setTimeout(() => {
          copy.classList.remove('copied');
        }, 2000);
      }
      document.querySelector('#embed').addEventListener('click', generateCode);
      copy.addEventListener('click', copyCode);
    })();
  </script>
</div>

```html
<iframe
  src="https://app.goabstract.com/embed/"
  width="784"
  height="360"
  frameborder="0"
></iframe>
```

## Manually creating an embed

Given a public share link:

`https://share.goabstract.com/c53e8159-2e24-4118-b02b-6fe4b3a3afee`

An embed can be created by using the following URL as the `src` of an `<iframe>`:

`https://app.goabstract.com/embed/c53e8159-2e24-4118-b02b-6fe4b3a3afee`

## Chrome-less embeds

Sometimes it's preferable to hide Abstract-specific UI components within an embed until the embed is hovered. This can provide a more-seamless visual look and feel when using embeds in certain contexts. To achieve this, a `chromeless` URL parameter can be added to an embed's URL:

`https://app.goabstract.com/embed/c53e8159-2e24-4118-b02b-6fe4b3a3afee&chromeless`

## Examples

The following examples demonstrate both layer and collection embeds created from the above share link.

### Layer embed

```html
<iframe
  src="https://app.goabstract.com/embed/c53e8159-2e24-4118-b02b-6fe4b3a3afee"
  width="784"
  height="360"
  frameborder="0"
></iframe>
```

<iframe src="https://app.goabstract.com/embed/c53e8159-2e24-4118-b02b-6fe4b3a3afee" width="784" height="360" frameborder="0"></iframe>

### Collection embed

```html
<iframe
  src="https://app.goabstract.com/embed/733ca894-a4bb-43e3-a2b1-dd27ff6d00c4"
  width="784"
  height="360"
  frameborder="0"
></iframe>
```

<iframe src="https://app.goabstract.com/embed/733ca894-a4bb-43e3-a2b1-dd27ff6d00c4" width="784" height="360" frameborder="0"></iframe>

<style>
  #embed-gen {
    position: relative;
  }
  #embed {
    background: #2e2f30;
    color: #fff;
    cursor: pointer;
    position: absolute;
    right: 3px;
    top: 3px;
  }
  #embed-input {
    border-radius: 3px;
    border: 1px solid;
    color: #717171;
    font-size: 14px;
    font-weight: 400;
    line-height: calc(1.2em + 6px);
    outline: none;
    overflow: hidden;
    padding: 10px 75px 10px 10px;
    text-overflow: ellipsis;
    transition: background 0.3s, color 0.3s;
    white-space: nowrap;
    width:  100%;
  }
  #embed-input:focus {
    color: #2e2f30;
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
  }
  #embed-input::-webkit-input-placeholder {
    color: #717171;
  }
  #embed-input::-moz-input-placeholder {
    color: #717171;
  }
  #embed-input::placeholder {
    color: #717171;
  }
  #embed-gen + pre > code {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    margin-top: -2px;
    overflow: hidden;
  }
  #embed-gen + pre > code > * {
    opacity: 0;
  }
  #embed-gen.done + pre > code > * {
    opacity: 1;
  }
  #waiting {
    color: #FFF;
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    font-size: 13.6px;
    left: 24px;
    position: absolute;
    top: 64px;
  }
  .done #waiting {
    display: none;
  }
  .hidden {
    height: 0px;
    overflow: hidden;
    width: 0px;
  }
  #copy {
    background: #FFF;
    border-color: #FFF;
    color: #2e2f30;
    cursor: pointer;
    display: none;
    font-size: 10px;
    padding: 5px;
    position: absolute;
    right: 8px;
    top: 170px;
  }
  #copy.copied:before {
    content: '✓';
    display: inline-block;
    margin-right: 4px;
  }
  .done #copy {
    display: block;
  }
</style>
