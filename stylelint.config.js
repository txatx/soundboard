export default {
  extends: ["stylelint-config-standard-scss", "stylelint-config-twbs-bootstrap"],
  plugins: ["stylelint-order"],
  rules: {
    "@stylistic/number-leading-zero": "always",
    "color-hex-length": "long",
    "color-function-notation": "modern",
    "declaration-empty-line-before": [
      "always",
      {
        except: ["after-declaration", "first-nested"],
        ignore: ["after-comment", "inside-single-line-block"]
      }
    ],
    "order/properties-order": null,
    "order/properties-alphabetical-order": [true, { severity: "warning" }],
    "selector-class-pattern": null,
    "selector-max-class": 5,
    "selector-max-id": 2
  }
};
