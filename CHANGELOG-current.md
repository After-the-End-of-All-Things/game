# [0.4.0](https://github.com/After-the-End-of-All-Things/game/compare/v0.3.1...v0.4.0) (2023-09-22)


### Bug Fixes

* **api:** only log 5xx errors ([15cb866](https://github.com/After-the-End-of-All-Things/game/commit/15cb86642825d96c4700b91f1af4fd4fd5fa6276))
* **api:** recapture http errors as real errors, split user messages and errors up ([35b09b5](https://github.com/After-the-End-of-All-Things/game/commit/35b09b55f1c2630f856eeba53425395d6054388c))
* **api:** refactor all manual usages of notifications into a wrapped function for consistent usage ([67173d8](https://github.com/After-the-End-of-All-Things/game/commit/67173d8bb641b41155bc404ae824e37027e5b828))
* **api:** rework lots of internal getters to guarantee existence rather than check in every subfunction ([f468476](https://github.com/After-the-End-of-All-Things/game/commit/f468476627658d4bb5dd10b9bd553ba95db57322))
* **auth:** auth should not throw errors, instead should return them ([7444cdd](https://github.com/After-the-End-of-All-Things/game/commit/7444cdd19b95c29c85628e18ac12169df7db8d4e))
* **explore:** explore will no longer throw when you try to find an item ([2cb92c9](https://github.com/After-the-End-of-All-Things/game/commit/2cb92c9bb7f547429b892411a9af4e5b26c41b57))
* **explore:** wave now shows the correct profile picture for the recipient ([173588a](https://github.com/After-the-End-of-All-Things/game/commit/173588a30e3f5e77a185cc23957a80b7a7bb68c1))
* **inventory:** item stats recalculate properly ([f00bc1f](https://github.com/After-the-End-of-All-Things/game/commit/f00bc1fb0a9e96ed67e746e4124bb7c791e3a550))
* **lottery:** allow players to buy lottery tickets at any time ([862f6b6](https://github.com/After-the-End-of-All-Things/game/commit/862f6b67e64d76f5e67df41ad3f53c8574d7e3f7))
* **lottery:** jackpot updates after buying a ticket ([44c039c](https://github.com/After-the-End-of-All-Things/game/commit/44c039c83feaa8215041d34fe93ba30993d423b5))
* **lottery:** move daily reset to me page, do it correctly ([2004bc6](https://github.com/After-the-End-of-All-Things/game/commit/2004bc6c9e5c50e96713186f088fb8a6a5bb2e0c))
* **lottery:** ticket lottery shouldn't break the server anymore ([ff25e16](https://github.com/After-the-End-of-All-Things/game/commit/ff25e16328f3d04d6d79d32fc64476d67d757dd8))
* **notifications:** disable actions on old notifications ([1bc0110](https://github.com/After-the-End-of-All-Things/game/commit/1bc01101ca0767531949d0b3a1f24dfc9472edc7))
* **town:** list was not 100% width ([c576533](https://github.com/After-the-End-of-All-Things/game/commit/c57653337176043d43098df3643d8b4153113a41))


### Features

* **auth:** forgot password feature. email verification feature. change email/password feature. email verification badge on public profile for the cool kids ([afd68ce](https://github.com/After-the-End-of-All-Things/game/commit/afd68ce00f60480ce77d3021f043efa23a00be29))
* **combat:** sort abilities by whether or not you can use them ([ad11229](https://github.com/After-the-End-of-All-Things/game/commit/ad11229289e1354ed4ee5d2aa80bfd6e9cb0c8dc))
* **lottery:** notify winner if they win via ticket numbers ([01bdf63](https://github.com/After-the-End-of-All-Things/game/commit/01bdf6316da68b09663f73151488bf6f1b4a9940))
* **town:** add worship center ([bbdf35d](https://github.com/After-the-End-of-All-Things/game/commit/bbdf35d5399443ac6a525e0668ca0c26eb0fb8c1))
* **town:** add worship feature. add worship leaderboard. add worship to headless runner ([94edd14](https://github.com/After-the-End-of-All-Things/game/commit/94edd14c789cf5902063806b83d3b16aa1d4dd0f))



