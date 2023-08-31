## [0.1.7](https://github.com/After-The-End-Of-All-Things/game/compare/v0.1.6...v0.1.7) (2023-08-31)


### Bug Fixes

* **core:** hopefully add better error handling. closes [#133](https://github.com/After-The-End-Of-All-Things/game/issues/133) ([32f7944](https://github.com/After-The-End-Of-All-Things/game/commit/32f794400e38b9a84d18aee1fcb5a54433df41bb))
* **core:** merge all event sources into one websocket, fix client to utilize one, using a united interface. closes [#131](https://github.com/After-The-End-Of-All-Things/game/issues/131) ([00ed143](https://github.com/After-The-End-Of-All-Things/game/commit/00ed14376c95c4c25938bf97710b4075369746c0))
* **crafting:** change ambiguous collect to take ([d1826c1](https://github.com/After-The-End-Of-All-Things/game/commit/d1826c147ffcdbfba35989c00d22919dc37eece7))
* **fight:** fix fleeing a fight throwing fight not found [ending the fight twice is not sensible]. ([1a41808](https://github.com/After-The-End-Of-All-Things/game/commit/1a41808014d22a36285acc54f8b4e6a2a928f39b))
* **migration:** items will no longer migrate if they have an instance id (which triggers every time) ([11fe9c7](https://github.com/After-The-End-Of-All-Things/game/commit/11fe9c75bcb45c6bdfd408fd500985fcc1701c82))
* **ui:** segments are now colored by tertiary, instead of primary, to not clash with xp bars. closes [#142](https://github.com/After-The-End-Of-All-Things/game/issues/142) ([8b72209](https://github.com/After-The-End-Of-All-Things/game/commit/8b72209ffc2f4c7bf2a4aaa20d01fc862911f05a))
* **xp:** make xp require more every 10 levels ([5154541](https://github.com/After-The-End-Of-All-Things/game/commit/5154541f58aca327b0508a5474ed5937c443f33d))


### Features

* **ui:** add number formatting to more things on collections page ([865cf4d](https://github.com/After-The-End-Of-All-Things/game/commit/865cf4df275924811c37373c94f28fcca25a230d))
* **ui:** improve descriptions for non-raw-percent values in travel screen, closes [#121](https://github.com/After-The-End-Of-All-Things/game/issues/121) ([145f88c](https://github.com/After-The-End-Of-All-Things/game/commit/145f88c47abdba560ba6b2c13df62859b1e364ae))



