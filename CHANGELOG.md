# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.1](https://github.com/vanwagonet/comma-separated/compare/v2.0.0...v2.0.1) (2019-02-21)



<a name="2.0.0"></a>
# 2.0.0 (2017-05-18)


### Bug Fixes

* handle empty fields as empty string ([595ead0](https://github.com/thetalecrafter/comma-separated/commit/595ead0))


### Performance Improvements

* avoid function call if no replacer/reviver passed in ([0805a32](https://github.com/thetalecrafter/comma-separated/commit/0805a32))


### BREAKING CHANGES

* Numeric text is no longer converted to numbers.

If you need this, you will need to provide a reviver function to do
the parsing.
