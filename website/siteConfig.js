/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
  title: "Abstract SDK",
  tagline: "A universal javascript binding for the Abstract API and CLI",
  url: "https://developer.abstract.com",
  baseUrl: "/",
  editUrl: "https://github.com/goabstract/abstract-sdk/edit/master/docs/",

  // Used for publishing and more
  projectName: "abstract-sdk",
  organizationName: "goabstract",
  headerLinks: [
    { doc: "installation", label: "Getting started" },
    { doc: "abstract-api", label: "API Reference" }
  ],

  gaTrackingId: "UA-102434873-3",

  // List of projects/orgs using your project for the users page.
  // users: [
  //   {
  //     caption: "Abstract",
  //     // You will need to prepend the image path with your baseUrl
  //     // if it is not '/', like: '/test-site/img/docusaurus.svg'.
  //     image: "img/docusaurus.svg",
  //     infoLink: "https://goabstract.com",
  //     pinned: true
  //   }
  // ],

  /* path to images for header/footer */
  headerIcon: "img/logo.svg",
  footerIcon: "img/logo.svg",
  favicon: "img/favicon.png",

  /* Colors for website */
  colors: {
    primaryColor: "#2e2f30",
    secondaryColor: "#157ff3"
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Elastic Projects`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: "atom-one-dark"
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [
    "https://buttons.github.io/buttons.js",
    {
      src: "js/marketo.js",
      defer: true
    }
  ],

  // On page navigation for the current documentation page.
  onPageNav: "separate",
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: "img/social.png",
  twitterImage: "img/social.png",

  repoUrl: "https://github.com/goabstract/abstract-sdk"
};

module.exports = siteConfig;
