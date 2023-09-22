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



## [0.3.1](https://github.com/After-the-End-of-All-Things/game/compare/v0.3.0...v0.3.1) (2023-09-19)


### Bug Fixes

* **combat:** combat page shouldn't fail when no fight exists ([16ecf0c](https://github.com/After-the-End-of-All-Things/game/commit/16ecf0c2288434f1471573c5380557d8163210c7))
* **crafting:** fix crafting time display for seconds ([cd65c0f](https://github.com/After-the-End-of-All-Things/game/commit/cd65c0f6cf59c1a7b5b749c993f6fe28e1170669))
* **itemstats:** sort stats alphabetically when displaying them in a list ([bae4680](https://github.com/After-the-End-of-All-Things/game/commit/bae4680790946d711c8cb8e425f89c85d0955dfd))
* **markdown:** markdown renderers shouldn't try to render something that doesn't exist ([8bfd769](https://github.com/After-the-End-of-All-Things/game/commit/8bfd7692043ee4c25fb2ee5c1f4d62dca980387b))
* **me:** me page shouldn't error when you don't have job levels set ([435c3c3](https://github.com/After-the-End-of-All-Things/game/commit/435c3c356febf72a155b78f0ef2901430af6983c))
* **rollbar:** do not track errors that dont have a message ([c2e693f](https://github.com/After-the-End-of-All-Things/game/commit/c2e693fb3c6379150f94052b23e02f3f5f199809))


### Features

* **combat:** add tooltips on elements to indicate bonus damage ([cdaf0ac](https://github.com/After-the-End-of-All-Things/game/commit/cdaf0ac370678a8c33c8f1778513155911f1aefd))
* **explore:** job change now has a dialog ([ffc87a9](https://github.com/After-the-End-of-All-Things/game/commit/ffc87a9730a2d267944e40d2e1bca67e2e73b35e))
* **inventory:** show stats in inventory table, rework some table ([92a0bb7](https://github.com/After-the-End-of-All-Things/game/commit/92a0bb7f1d182c0d3506774b8619dc7392d15e0c))
* **lottery:** add notification for lottery claiming ([a652d4f](https://github.com/After-the-End-of-All-Things/game/commit/a652d4f57b7df1c354e4e40e9d4e7c5fc094b2e9))
* **lottery:** add ticket lottery. closes [#100](https://github.com/After-the-End-of-All-Things/game/issues/100) ([1e4222e](https://github.com/After-the-End-of-All-Things/game/commit/1e4222e8ad8dbecd0ecec04b5e21d2bd03fe97c5))
* **profile:** separate weapon/basic abilities, add move/flee to basic ([d2734b8](https://github.com/After-the-End-of-All-Things/game/commit/d2734b894d45448cb294d40463b6975b42653914))



# [0.3.0](https://github.com/After-the-End-of-All-Things/game/compare/v0.2.0...v0.3.0) (2023-09-17)


### Bug Fixes

* **ability:** ability display synced between list and combat ([a82bc83](https://github.com/After-the-End-of-All-Things/game/commit/a82bc8322273d9799512b194819db20aa2305560))
* **api:** add a rate limiter to prevent duplicate actions from seeping through ([1304f48](https://github.com/After-the-End-of-All-Things/game/commit/1304f4807a9d770dbd08344c2b0994a5b67ec5a5))
* **api:** api will no longer send patches with _id in them, closes [#79](https://github.com/After-the-End-of-All-Things/game/issues/79) ([54b9d03](https://github.com/After-the-End-of-All-Things/game/commit/54b9d033712d0877cc76bc12066c0d4129b0e72a))
* **api:** internal ids for market and fight should work better ([32204ac](https://github.com/After-the-End-of-All-Things/game/commit/32204ac79125a8a4577bce04bf2460e3ed340efc))
* **collection:** better card number display ([e0f3982](https://github.com/After-the-End-of-All-Things/game/commit/e0f39825e181dde315043e6fad07c5130e124b92))
* **collections:** ui now looks better in firefox ([71edd01](https://github.com/After-the-End-of-All-Things/game/commit/71edd016c88089e60c995446e707b01fd97956d7))
* **combat:** add a safeguard for restarting combats when all enemies are dead but combat is frozen ([4b9002c](https://github.com/After-the-End-of-All-Things/game/commit/4b9002ca52fda27c219a04409a363f326e011ceb))
* **combat:** background image no longer blocks ground targetted skills ([4a361bf](https://github.com/After-the-End-of-All-Things/game/commit/4a361bf9abc969b8beaf89a1a6cf728fb05f8c66))
* **combat:** correctly adjust combat ability display for current element multiplier ([ee3d068](https://github.com/After-the-End-of-All-Things/game/commit/ee3d06818f2fb09fbeca363b923f81f43b38d165))
* **combat:** fix combat freeze when trying to give item rewards ([45c82dd](https://github.com/After-the-End-of-All-Things/game/commit/45c82dd02ee4b119605875d810e87a90526af437))
* **combat:** fix elemental damage math to actually boost hit chance ([05cdeb8](https://github.com/After-the-End-of-All-Things/game/commit/05cdeb830ebfe576d75156437e4c86367f075910))
* **combat:** fix twohorizontal and threevertical targetting. fix up visuals ([2e76cfe](https://github.com/After-the-End-of-All-Things/game/commit/2e76cfe99ebef3560b5a124a02bd153b6743fac3))
* **combat:** hide special gauge if you have no special moves ([773dcaf](https://github.com/After-the-End-of-All-Things/game/commit/773dcaf66f56e74c456b7c82a09bf299a4f651b3))
* **combat:** npcs will no longer try to use things that are on cooldown ([45a117c](https://github.com/After-the-End-of-All-Things/game/commit/45a117c2f23e07834561ddc0fdec5cda17a45c68))
* **combat:** show ability icons ([a1c2874](https://github.com/After-the-End-of-All-Things/game/commit/a1c287474dba58cccc0b20c8ba347b2251b39158))
* **core:** rework all _id/id to internalId ([417fe1c](https://github.com/After-the-End-of-All-Things/game/commit/417fe1ca665632f2118abb3e08e801d5ed11ebc4))
* **crafting:** crafting page should show collected items correctly. closes [#122](https://github.com/After-the-End-of-All-Things/game/issues/122) ([fc4d3f7](https://github.com/After-the-End-of-All-Things/game/commit/fc4d3f7f94b32d71522586bb4c73d677195f7295))
* **crafting:** crafting that no longer gives xp will have a different button color. closes [#90](https://github.com/After-the-End-of-All-Things/game/issues/90) ([1ff38f3](https://github.com/After-the-End-of-All-Things/game/commit/1ff38f39a5d247ff03262b2d317cbcf8cb761aec))
* **equipment:** chips are no longer clickable, even though that's really fun. closes [#86](https://github.com/After-the-End-of-All-Things/game/issues/86) ([f1454cd](https://github.com/After-the-End-of-All-Things/game/commit/f1454cdda6f31d474de315c54109712f25d9490f))
* **fight:** fix check for invalid fights ([a7208dc](https://github.com/After-the-End-of-All-Things/game/commit/a7208dc35b7e14b8e8559f40dda2214ae978ecda))
* **fight:** running away no longer puts you in a phantom fight ([a9b4c3e](https://github.com/After-the-End-of-All-Things/game/commit/a9b4c3e2d8d9e076c76e6124e74c7f4d4fac0b20))
* **leaderboard:** leaderboard queries shouldnt throw an error ([345ac54](https://github.com/After-the-End-of-All-Things/game/commit/345ac549fa19d944493f4dc7b4c0b833e36f81d1))
* **leaderboard:** walking to a location will correctly put you on the leaderboard for that location ([8100022](https://github.com/After-the-End-of-All-Things/game/commit/81000225e1d502b9a530ce9b0d4f5b5f879fa6e7))
* **login:** update latest announcement visuals to be slightly better ([3ee6d69](https://github.com/After-the-End-of-All-Things/game/commit/3ee6d6997ca797672fc83f1b391010334a379b4a))
* **notification:** fix notification generating with incorrect ids for actions ([2db2e8e](https://github.com/After-the-End-of-All-Things/game/commit/2db2e8ec22fd2ab4454109af5a3b93d876a47310))
* **profile:** add loading spinner, better validation for invalid profiles ([94a504e](https://github.com/After-the-End-of-All-Things/game/commit/94a504ea354f6333da6f558310e8d4b8707fd6e1))
* **profile:** can no longer open and click confirm to set your portrait to itself. closes [#98](https://github.com/After-the-End-of-All-Things/game/issues/98) ([4d1db50](https://github.com/After-the-End-of-All-Things/game/commit/4d1db50c7273ac18a8f841f09b89188bcdab3f44))
* **profile:** can now select bg/portrait 0 ([6b5d899](https://github.com/After-the-End-of-All-Things/game/commit/6b5d899f14e25a33d0d3a82af1747d5e47cff5bb))
* **profile:** fix people who dont have otherJobLevels set ([56d92f7](https://github.com/After-the-End-of-All-Things/game/commit/56d92f7e85765999437de2dda9c753636a5a9220))
* **profile:** fix some errors causing the page to not render correctly ([d7fbca8](https://github.com/After-the-End-of-All-Things/game/commit/d7fbca86af2b468ae30d91db6192715790edee4b))
* **profile:** stats query for profile should work correctly ([b8fde7b](https://github.com/After-the-End-of-All-Things/game/commit/b8fde7b0a34df4faed38c507d4a15f5297d0442a))
* **sprite:** no more -1git statusgit status! ([719e021](https://github.com/After-the-End-of-All-Things/game/commit/719e0214ce6b72b95a36c490351d821f52712082))
* **table:** all data tables are less bad looking now. closes [#66](https://github.com/After-the-End-of-All-Things/game/issues/66) ([f4c6c68](https://github.com/After-the-End-of-All-Things/game/commit/f4c6c68b5a66a206386e359d599de5c902a9bb80))
* **travel:** can no longer travel when looking at monsters. travel resets your action. closes [#169](https://github.com/After-the-End-of-All-Things/game/issues/169) ([cdc5fe2](https://github.com/After-the-End-of-All-Things/game/commit/cdc5fe2745f452fb98b8808069e970a3a50033ec))
* **ui:** background images load correctly on first load. closes [#147](https://github.com/After-the-End-of-All-Things/game/issues/147) ([dab403c](https://github.com/After-the-End-of-All-Things/game/commit/dab403c1fb25677f4629edfdb8c123f41fbf9734))
* **ui:** claim coin notif will no longer persist until refresh ([3303202](https://github.com/After-the-End-of-All-Things/game/commit/3303202f71459e8b3078dfd8129a48587712a569))
* **ui:** no more -1 in sprite icons ([ff4ac76](https://github.com/After-the-End-of-All-Things/game/commit/ff4ac7619cf43d4e4ca40ffeee5ac478bcb6f54c))


### Features

* **combat:** add 'all enemies' targetting ([4cb2bde](https://github.com/After-the-End-of-All-Things/game/commit/4cb2bde2d76afffaffd45d6ecc9446451f9f9923))
* **combat:** add neat background underlay for fights ([e2529e1](https://github.com/After-the-End-of-All-Things/game/commit/e2529e1312d53ff647cee0a62fe882560784622b))
* **combat:** add special gauge, make special attacks require special gauge ([8fe5908](https://github.com/After-the-End-of-All-Things/game/commit/8fe59089682c42e1811ee156605fa966d63c5764))
* **combat:** combat can now drop items. closes [#106](https://github.com/After-the-End-of-All-Things/game/issues/106) ([7ac4312](https://github.com/After-the-End-of-All-Things/game/commit/7ac4312c60092329a5d7a94ad781a6650fe1cd02))
* **combat:** damage is more random - more resist/toughness merely improves chance for damage to be 0 ([6f10969](https://github.com/After-the-End-of-All-Things/game/commit/6f10969973ec3b0cae03acde610595d25f53d0c5))
* **combat:** make skill popup bigger ([57ad440](https://github.com/After-the-End-of-All-Things/game/commit/57ad440966532c139e8f2a1d0ecaadc8fdf851c1))
* **combat:** show hit percentage for each creature ([7e5a9a9](https://github.com/After-the-End-of-All-Things/game/commit/7e5a9a933b36ee46ea3c608746d4ae32e05b25aa))
* **combat:** show tooltip for damage calculations for abilities ([0c2bed7](https://github.com/After-the-End-of-All-Things/game/commit/0c2bed7c962f11c484f5e2be4a64bd87d9b19bfc))
* **combat:** some abilities hit multiple times ([c682e35](https://github.com/After-the-End-of-All-Things/game/commit/c682e3545f2f4da9d44d7f516de6dacb5d664977))
* **combat:** some skills can require a specific piece of equipment to function ([827993c](https://github.com/After-the-End-of-All-Things/game/commit/827993c5de9612a537a49992d8a9c743fc1721fc))
* **content:** load game content from server instead of global if the server is available ([5682eee](https://github.com/After-the-End-of-All-Things/game/commit/5682eee25fbe50ff4933de16e5cd572d88c4fb78))
* **equipment:** can now unequip from equipment page. closes [#103](https://github.com/After-the-End-of-All-Things/game/issues/103) ([29c83a0](https://github.com/After-the-End-of-All-Things/game/commit/29c83a009473acd6a3cc5d2c98023ef90a08a2cb))
* **equipment:** show equipment level on equipment page ([c626ddc](https://github.com/After-the-End-of-All-Things/game/commit/c626ddc2bde9aa66696f00c26d02d033fffcc2ad))
* **explore:** you can only wave at a person once every 12 hours, closes [#51](https://github.com/After-the-End-of-All-Things/game/issues/51) ([6400445](https://github.com/After-the-End-of-All-Things/game/commit/6400445022d6a2c839140abba60c70c9a836637e))
* **job:** jobs have their own level, xp, and equipment. profile and public profile pages updated to match. ([7c48a4d](https://github.com/After-the-End-of-All-Things/game/commit/7c48a4d18f613429fcb5bd3b3470c612c0bffe2f))
* **login:** auto redirect to game from login page if you're authed ([c25f48c](https://github.com/After-the-End-of-All-Things/game/commit/c25f48cecbc7cc463b12cec8362cbfac98f3c5b6))
* **login:** login page vastly improved ([82e7b49](https://github.com/After-the-End-of-All-Things/game/commit/82e7b492a05ddaa0fcafee22a3387aa1c1076a70))
* **lottery:** there is now a daily player lottery for players to get rewards from. closes [#99](https://github.com/After-the-End-of-All-Things/game/issues/99) ([f66a22a](https://github.com/After-the-End-of-All-Things/game/commit/f66a22acf7fcb22497bc5739ab74aa20b82f293a))
* **notifications:** clear expired notifications. closes [#49](https://github.com/After-the-End-of-All-Things/game/issues/49) ([53475dc](https://github.com/After-the-End-of-All-Things/game/commit/53475dc8e3884b6427872c44d412390ddcfe8755))
* **notifications:** levelup notifications now include your class ([2cb17b5](https://github.com/After-the-End-of-All-Things/game/commit/2cb17b5479de48b27b97788f5c17cedbc926b018))
* **player:** inform players of newly learned abilities on levelup ([57c3478](https://github.com/After-the-End-of-All-Things/game/commit/57c34783d04bd393476dd7beffaade25d301d9f8))
* **profile:** add abilities tab for classes ([e078643](https://github.com/After-the-End-of-All-Things/game/commit/e078643c7afd03c11eb4c929b3f991f61556bc2d))
* **showcase:** add profile page, showcases. closes [#36](https://github.com/After-the-End-of-All-Things/game/issues/36) ([7d37ad8](https://github.com/After-the-End-of-All-Things/game/commit/7d37ad8b9d4884ae075b65193a68ab5cb3139843))
* **testing:** add test script to run a bunch of players. closes [#60](https://github.com/After-the-End-of-All-Things/game/issues/60) ([33e2262](https://github.com/After-the-End-of-All-Things/game/commit/33e22620b234d1aa9adc6ee2a32fa4536b98e356))
* **ui:** add a loading screen so users can see what's going on. closes [#175](https://github.com/After-the-End-of-All-Things/game/issues/175) ([83d206a](https://github.com/After-the-End-of-All-Things/game/commit/83d206a1c4fbe53862279adf791e3166c2645a79))
* **ui:** add textures ([b3e4848](https://github.com/After-the-End-of-All-Things/game/commit/b3e4848da81669440d9168e586ea8bcd23f3dc17))
* **ui:** oats/coins in hero will be monospaced ([6dc17f1](https://github.com/After-the-End-of-All-Things/game/commit/6dc17f13c938ba98be2e3f9877153aca958c9c34))
* **ui:** pages with tabs now remember what tab you were looking at ([5d0928b](https://github.com/After-the-End-of-All-Things/game/commit/5d0928b548babb3367439cd821719b494e1b4cc1))
* **ui:** sidebar will now show if you have coins to claim from the market (on refresh, not pushed), closes [#91](https://github.com/After-the-End-of-All-Things/game/issues/91) ([5a6a250](https://github.com/After-the-End-of-All-Things/game/commit/5a6a250d17335e791e2b5d9b7810bdc919c2ec31))



# [0.2.0](https://github.com/After-the-End-of-All-Things/game/compare/v0.1.12...v0.2.0) (2023-09-10)


### Bug Fixes

* **collections:** Fix off-by-one error in portrait display, closes [#154](https://github.com/After-the-End-of-All-Things/game/issues/154) ([#165](https://github.com/After-the-End-of-All-Things/game/issues/165)) ([82bea8a](https://github.com/After-the-End-of-All-Things/game/commit/82bea8adeb0798859b892b674a2b021cc900d10f))
* **combat:** make time between turns go 5x faster, closes [#168](https://github.com/After-the-End-of-All-Things/game/issues/168) ([7d49e2b](https://github.com/After-the-End-of-All-Things/game/commit/7d49e2ba83809aa9aaa44c99567eede780af6bcb))
* **explore:** disable explore button immediately, closes [#125](https://github.com/After-the-End-of-All-Things/game/issues/125) ([#162](https://github.com/After-the-End-of-All-Things/game/issues/162)) ([6c644e7](https://github.com/After-the-End-of-All-Things/game/commit/6c644e7892e5495612b28475e03e5a217d8a1696))


### Features

* **combat:** rework display area to not have name on the sprite. closes [#164](https://github.com/After-the-End-of-All-Things/game/issues/164) ([f35f928](https://github.com/After-the-End-of-All-Things/game/commit/f35f928ce43094b1deb6adcd9df75b1b63b01371))
* **dx:** PRs will now have a required title or commit format ([2592041](https://github.com/After-the-End-of-All-Things/game/commit/2592041c22b66db5ee3d50141f2cf666364769f2))
* **explore:** can find npcs that unlock backgrounds and sprites ([4283587](https://github.com/After-the-End-of-All-Things/game/commit/4283587270d488a0fcabcd0d4a831110a3ae41a7))
* **explore:** you can now encounter npcs who will let you change your class ([a4e3fd1](https://github.com/After-the-End-of-All-Things/game/commit/a4e3fd138c95431030635c150042e1072f07c96b))
* **town:** add leaderboards to towns. closes [#123](https://github.com/After-the-End-of-All-Things/game/issues/123) ([17b6bab](https://github.com/After-the-End-of-All-Things/game/commit/17b6babbabdb0f5f851413094be5223ad0b6507c))
* **ui:** can choose backgrounds. one background can be found ([fdf5707](https://github.com/After-the-End-of-All-Things/game/commit/fdf5707e951fc1f183afa252846f2982f1938d8d))



## [0.1.12](https://github.com/After-the-End-of-All-Things/game/compare/v0.1.11...v0.1.12) (2023-09-08)


### Bug Fixes

* **client:** put version.json in the correct folder. closes [#155](https://github.com/After-the-End-of-All-Things/game/issues/155) ([1bdb25e](https://github.com/After-the-End-of-All-Things/game/commit/1bdb25e0d030e4789a7e2aa0a8ea2132311e1d39))
* **combat:** actually skip characters who have no turn - no glowing ([3a4ba9a](https://github.com/After-the-End-of-All-Things/game/commit/3a4ba9a201c1e0689ba0569917657faf6fc050be))
* **combat:** remove invalid fights if they ever occur. closes [#127](https://github.com/After-the-End-of-All-Things/game/issues/127) ([c39e8fb](https://github.com/After-the-End-of-All-Things/game/commit/c39e8fb856c4957784d9d5a7e1bd179c3d76e4b5))
* **combat:** ui should downscale better for fights. closes [#119](https://github.com/After-the-End-of-All-Things/game/issues/119) ([44957eb](https://github.com/After-the-End-of-All-Things/game/commit/44957eb97ffd226907a1c3fb91f3db70b58c8305))
* **discoveries:** you can now discover a monster multiple times ([03121d4](https://github.com/After-the-End-of-All-Things/game/commit/03121d4b8f20a66cc6433e4eea15c8c9a3b5fe1e))
* **inventory:** can take resources when your normal inventory is full ([c4770f1](https://github.com/After-the-End-of-All-Things/game/commit/c4770f1dadab5e58e8d804118a5b46de234a7410))
* **ui:** when taking an item from explore, the update event is fired correctly. closes [#150](https://github.com/After-the-End-of-All-Things/game/issues/150) ([80cec50](https://github.com/After-the-End-of-All-Things/game/commit/80cec509632cfb35f2ca4b2850e58ea7131d5318))


### Features

* **combat:** use toughness/resistance. closes [#115](https://github.com/After-the-End-of-All-Things/game/issues/115) ([bff0e25](https://github.com/After-the-End-of-All-Things/game/commit/bff0e25c53b95fb67e3c179949df0e12c88d3b82))
* **explore:** monster formations are weighted ([4929a08](https://github.com/After-the-End-of-All-Things/game/commit/4929a0831b3d16c7d6e645feae029559c7be05df))



## [0.1.11](https://github.com/After-the-End-of-All-Things/game/compare/v0.1.10...v0.1.11) (2023-09-07)


### Bug Fixes

* **combat:** attempt to fix FNF by not ending the fight twice. closes [#128](https://github.com/After-the-End-of-All-Things/game/issues/128) ([766b23c](https://github.com/After-the-End-of-All-Things/game/commit/766b23c2c992c7db08d97a9c74cc2248beea02b1))



## [0.1.10](https://github.com/After-the-End-of-All-Things/game/compare/v0.1.9...v0.1.10) (2023-09-07)


### Bug Fixes

* **combat:** enemies now respect ability cooldowns ([2c48b6d](https://github.com/After-the-End-of-All-Things/game/commit/2c48b6d0df79e4323ff755e25931b482c4659e30))
* **core:** remove optional values in items, closes [#97](https://github.com/After-the-End-of-All-Things/game/issues/97) ([e4fba4b](https://github.com/After-the-End-of-All-Things/game/commit/e4fba4b06b50c2cc2a19b3113295a3dea52aa51c))
* **core:** use ws instead of sse. closes [#149](https://github.com/After-the-End-of-All-Things/game/issues/149) ([4ca44a6](https://github.com/After-the-End-of-All-Things/game/commit/4ca44a6481936f69ec715efdfc452a75709e44a4))
* **explore:** no explore while in combat, closes [#148](https://github.com/After-the-End-of-All-Things/game/issues/148) ([a4c9756](https://github.com/After-the-End-of-All-Things/game/commit/a4c9756ad360228702e9e79a1757864ec4406255))


### Features

* **ui:** show level up when you level up from exploring, instead of negative xp. closes [#116](https://github.com/After-the-End-of-All-Things/game/issues/116) ([3ebefe5](https://github.com/After-the-End-of-All-Things/game/commit/3ebefe5d43542745c5e3c15a96f5a67ec79f1c6d))



## [0.1.9](https://github.com/After-the-End-of-All-Things/game/compare/v0.1.8...v0.1.9) (2023-08-31)


### Bug Fixes

* **core:** do not show full urls for sse - they flood logs. closes [#117](https://github.com/After-the-End-of-All-Things/game/issues/117) ([56391b8](https://github.com/After-the-End-of-All-Things/game/commit/56391b84030103ab99cfc12e94d3a36ca9cced07))
* **errors:** rethrow some db-adjacent errors ([52634c8](https://github.com/After-the-End-of-All-Things/game/commit/52634c81833cd46273b2edffcc061cc56fb55bb3))


### Features

* **ui:** add coin/oat icons ([f2fa7df](https://github.com/After-the-End-of-All-Things/game/commit/f2fa7dfcfd56fad97cc4f44c7cc9e68d213a5190))
* **ui:** call out dev mode for browser tab name ([3bea2ee](https://github.com/After-the-End-of-All-Things/game/commit/3bea2eee067bd43b04615f9ba2b97959f79e79ce))



## [0.1.8](https://github.com/After-the-End-of-All-Things/game/compare/v0.1.7...v0.1.8) (2023-08-31)


### Bug Fixes

* **combat:** combat ends correctly ([983e075](https://github.com/After-the-End-of-All-Things/game/commit/983e0759a9eff46278ba1523dc75e44f6fb5a282))


### Features

* **ui:** add lots of custom icons. closes [#64](https://github.com/After-the-End-of-All-Things/game/issues/64) ([0846bb2](https://github.com/After-the-End-of-All-Things/game/commit/0846bb2102a8be16ec9604c0847b4837bec54591))



## [0.1.7](https://github.com/After-the-End-of-All-Things/game/compare/v0.1.6...v0.1.7) (2023-08-31)


### Bug Fixes

* **core:** hopefully add better error handling. closes [#133](https://github.com/After-the-End-of-All-Things/game/issues/133) ([32f7944](https://github.com/After-the-End-of-All-Things/game/commit/32f794400e38b9a84d18aee1fcb5a54433df41bb))
* **core:** merge all event sources into one websocket, fix client to utilize one, using a united interface. closes [#131](https://github.com/After-the-End-of-All-Things/game/issues/131) ([00ed143](https://github.com/After-the-End-of-All-Things/game/commit/00ed14376c95c4c25938bf97710b4075369746c0))
* **crafting:** change ambiguous collect to take ([d1826c1](https://github.com/After-the-End-of-All-Things/game/commit/d1826c147ffcdbfba35989c00d22919dc37eece7))
* **fight:** fix fleeing a fight throwing fight not found [ending the fight twice is not sensible]. ([1a41808](https://github.com/After-the-End-of-All-Things/game/commit/1a41808014d22a36285acc54f8b4e6a2a928f39b))
* **migration:** items will no longer migrate if they have an instance id (which triggers every time) ([11fe9c7](https://github.com/After-the-End-of-All-Things/game/commit/11fe9c75bcb45c6bdfd408fd500985fcc1701c82))
* **ui:** segments are now colored by tertiary, instead of primary, to not clash with xp bars. closes [#142](https://github.com/After-the-End-of-All-Things/game/issues/142) ([8b72209](https://github.com/After-the-End-of-All-Things/game/commit/8b72209ffc2f4c7bf2a4aaa20d01fc862911f05a))
* **xp:** make xp require more every 10 levels ([5154541](https://github.com/After-the-End-of-All-Things/game/commit/5154541f58aca327b0508a5474ed5937c443f33d))


### Features

* **ui:** add number formatting to more things on collections page ([865cf4d](https://github.com/After-the-End-of-All-Things/game/commit/865cf4df275924811c37373c94f28fcca25a230d))
* **ui:** improve descriptions for non-raw-percent values in travel screen, closes [#121](https://github.com/After-the-End-of-All-Things/game/issues/121) ([145f88c](https://github.com/After-the-End-of-All-Things/game/commit/145f88c47abdba560ba6b2c13df62859b1e364ae))



## [0.1.6](https://github.com/After-the-End-of-All-Things/game/compare/v0.1.5...v0.1.6) (2023-08-30)


### Bug Fixes

* **popover:** add attribute to make popovers load in the right place ([1e0d29e](https://github.com/After-the-End-of-All-Things/game/commit/1e0d29e35ee71e15781a62cce484f037f5e77e8e))
* **ui:** improve coloration on rarities. closes [#130](https://github.com/After-the-End-of-All-Things/game/issues/130) ([2b8d9e7](https://github.com/After-the-End-of-All-Things/game/commit/2b8d9e72dac1c863e7d4784558084dc6ec32593d))


### Features

* **analytics:** track more game events. closes [#118](https://github.com/After-the-End-of-All-Things/game/issues/118) ([6b60cd5](https://github.com/After-the-End-of-All-Things/game/commit/6b60cd5c81e98bd02e73bc7fb56337a31f815500))
* **api:** add game stats api endpoint to double check constants. closes [#138](https://github.com/After-the-End-of-All-Things/game/issues/138) ([1d7fa2e](https://github.com/After-the-End-of-All-Things/game/commit/1d7fa2e6238180be7c682ccc70ab67c37eb0f72a))
* **combat:** show if ability is physical or magical ([b71e952](https://github.com/After-the-End-of-All-Things/game/commit/b71e952e2eb87d9d11e74891910e00826746fb36))
* **core:** rip out discovery totals/rewards as constants ([d38d049](https://github.com/After-the-End-of-All-Things/game/commit/d38d04972b4b70c0ee5c3f64e7b16592e400d402))
* **core:** rip out find rates as constants ([14b461b](https://github.com/After-the-End-of-All-Things/game/commit/14b461ba8f650ef55e5f0dd6804618dddc976710))
* **inventory:** add loading spinner when loading inventory ([a7ffb2d](https://github.com/After-the-End-of-All-Things/game/commit/a7ffb2d4d9a3f5d2815ed601f16b001bbe2098e3))
* **stats:** track more stats - combat, explores, items. closes [#124](https://github.com/After-the-End-of-All-Things/game/issues/124) ([7ce1b75](https://github.com/After-the-End-of-All-Things/game/commit/7ce1b75ed6ab98129737f3d454e56332f67da4f8))
* **ui:** add tooltips to profile for stats, total collected to increase user clarity. closes [#136](https://github.com/After-the-End-of-All-Things/game/issues/136) ([197fd1e](https://github.com/After-the-End-of-All-Things/game/commit/197fd1e77384162a6f6b1939ff2f8be5c1935d28))



## [0.1.5](https://github.com/After-the-End-of-All-Things/game/compare/v0.1.4...v0.1.5) (2023-08-30)


### Bug Fixes

* **item:** discovering a bad equipment item will remove it ([2d2d1c8](https://github.com/After-the-End-of-All-Things/game/commit/2d2d1c821d55598ae00a0991c51bf5ec02fa3bd4))
* **item:** items/resources now cross-check so you can't get them in the wrong spots ([8f89d09](https://github.com/After-the-End-of-All-Things/game/commit/8f89d0926e0230fc5323dc57966154221416915d))
* **market:** market now always costs 1 coin to list at least ([49c5b11](https://github.com/After-the-End-of-All-Things/game/commit/49c5b116bbe8b9d8458e06d22c9dd3ddbf7fea64))



## [0.1.4](https://github.com/After-the-End-of-All-Things/game/compare/v0.1.3...v0.1.4) (2023-08-29)


### Bug Fixes

* **combat:** enemies will no longer attempt to move to the wrong side, halting the fight ([957fd3b](https://github.com/After-the-End-of-All-Things/game/commit/957fd3bcf1452452a27906f09267821b116f2643))
* **fight:** elemental damage is no longer wack. ground targetted spells work ([06b29f3](https://github.com/After-the-End-of-All-Things/game/commit/06b29f37871eb6ae2f761090cbeb9138e03e15be))
* **fight:** fights can end again ([079e22e](https://github.com/After-the-End-of-All-Things/game/commit/079e22ea0369f4f757bb3c9ea48f867c1b7b7ba4))
* **fight:** you can no longer kill dead creatures ([fa4e3cd](https://github.com/After-the-End-of-All-Things/game/commit/fa4e3cd0b89fd96cbef413070fb600328f71c25c))


### Features

* **core:** add logic to service paths, closes [#104](https://github.com/After-the-End-of-All-Things/game/issues/104) ([c628d71](https://github.com/After-the-End-of-All-Things/game/commit/c628d712e68c251880c6ea987b469e8d1588a1f1))



## [0.1.3](https://github.com/After-the-End-of-All-Things/game/compare/v0.1.2...v0.1.3) (2023-08-29)



## [0.1.2](https://github.com/After-the-End-of-All-Things/game/compare/v0.1.1...v0.1.2) (2023-08-29)


### Bug Fixes

* **build:** generate blog posts correctly ([902326e](https://github.com/After-the-End-of-All-Things/game/commit/902326e02eadef087c092d4bc156a0e5ad08a4be))



## [0.1.1](https://github.com/After-the-End-of-All-Things/game/compare/v0.1.0...v0.1.1) (2023-08-29)



# [0.1.0](https://github.com/After-the-End-of-All-Things/game/compare/0f26cbec9622f89edc58468e6a454b0abd7ea137...v0.1.0) (2023-08-29)


### Bug Fixes

* **action:** wave should have an actual user id ([05a8f7d](https://github.com/After-the-End-of-All-Things/game/commit/05a8f7d23432d18fba519b9c8d61c296500a3de8))
* **action:** wave should not default to waveback=true ([c187f57](https://github.com/After-the-End-of-All-Things/game/commit/c187f57bb41617374cd39be82dfc12bbb13b75ba))
* **analytics:** gameanalytics starts a session every time it sends an event now ([bdecd8a](https://github.com/After-the-End-of-All-Things/game/commit/bdecd8a92ad256978603a8e437d6e89b386e26f7))
* **analytics:** swallow error for sessionStart ([a8c6150](https://github.com/After-the-End-of-All-Things/game/commit/a8c61500403803ef469c5900302061996a4fbe7c))
* **api:** never trust the client. closes [#70](https://github.com/After-the-End-of-All-Things/game/issues/70) ([7f4027e](https://github.com/After-the-End-of-All-Things/game/commit/7f4027e8ed32edc2ee0423a385a9a5828efe1ed8))
* **api:** unite response values of services/controllers to all be the same interface ([aeadbda](https://github.com/After-the-End-of-All-Things/game/commit/aeadbda27264eee5b8d7146b91b58c961067c33b))
* **auth:** add auth guard to pages, closes [#52](https://github.com/After-the-End-of-All-Things/game/issues/52) ([2f35dcb](https://github.com/After-the-End-of-All-Things/game/commit/2f35dcb022e36d772a797872ea36a8e8b10b9da7))
* **avatar:** default avatar shown in modal is no longer +1'd ([d78e40e](https://github.com/After-the-End-of-All-Things/game/commit/d78e40e880838e7f4c7e565111f1893cd47a019e))
* **client:** fix rollbar sending client error cases ([91c545d](https://github.com/After-the-End-of-All-Things/game/commit/91c545d2bb551292566b4e8f70acf07d3c10dc56))
* **combat:** combat doesnt end every action ([e083f20](https://github.com/After-the-End-of-All-Things/game/commit/e083f20c651274904b6c51e2c569e408490adb9d))
* **combat:** fix fight not found errors ([654387a](https://github.com/After-the-End-of-All-Things/game/commit/654387a07a00b48f7ec637648abc081665a3f660))
* **equipment:** equipment will no longer lose its instance id when equipped ([cb5fa25](https://github.com/After-the-End-of-All-Things/game/commit/cb5fa2512945f6665f1e405b55b30b5b52e76d40))
* **explore:** explore would display negative xp if you leveled up from it ([96a671a](https://github.com/After-the-End-of-All-Things/game/commit/96a671a0719bd0716a6c09fbd9e76918daa72817))
* **icon:** fix icon component to fill space correctly ([2071220](https://github.com/After-the-End-of-All-Things/game/commit/2071220588ebc0fb8c8aff8ca15101373802297b))
* **inventory:** can equip accessories again. closes [#89](https://github.com/After-the-End-of-All-Things/game/issues/89) ([e12cec5](https://github.com/After-the-End-of-All-Things/game/commit/e12cec59b1e180e61880eafd63cfd1509ddc1b5d))
* **inventory:** names will wrap if needed ([8e156d9](https://github.com/After-the-End-of-All-Things/game/commit/8e156d9bb6fce513068f99de38210076bb6f7dd7))
* **login:** get notifications on login. closes [#54](https://github.com/After-the-End-of-All-Things/game/issues/54) ([2d028e1](https://github.com/After-the-End-of-All-Things/game/commit/2d028e11948a265d6fb13ef0648287f4bb278d84))
* **login:** no unauthorized error on homepage. closes [#53](https://github.com/After-the-End-of-All-Things/game/issues/53) ([ee575ce](https://github.com/After-the-End-of-All-Things/game/commit/ee575cea151f3dc2889a8c6622c92b004cfc82f4))
* **market:** can now list the last of a resource ([1901f37](https://github.com/After-the-End-of-All-Things/game/commit/1901f37b07460b9a75eac1168f8a6c425f945e87))
* **notifications:** mark all read should not send 1 event per notification ([2c52a6e](https://github.com/After-the-End-of-All-Things/game/commit/2c52a6efb4a0f6f977b96a4eac994b125c9bcdfd))
* **notifications:** notifications with actions will no longer race to submit data and clear the actions ([6293a4f](https://github.com/After-the-End-of-All-Things/game/commit/6293a4f49bb8be0407e8aea6660e556ad704b146))
* **portrait:** portrait selection is in the right place again ([2aec357](https://github.com/After-the-End-of-All-Things/game/commit/2aec3577dcd2c0401212642d9007074cbae86413))
* **profile:** tiny avatar shows again. closes [#63](https://github.com/After-the-End-of-All-Things/game/issues/63) ([c079201](https://github.com/After-the-End-of-All-Things/game/commit/c079201e1a6198efd7e7e6d798a3f9e1b7b960b2))
* **setup:** add setup script for client, fix error for server setup ([37733aa](https://github.com/After-the-End-of-All-Things/game/commit/37733aaff5e94ef43e80999fbd81721c41efa0df))
* **workflow:** only deploy server/client on tags ([6895cc3](https://github.com/After-the-End-of-All-Things/game/commit/6895cc3ba174f15222f652956d9f1ab61a7308e8))


### Features

* **actions:** better, more robust action handling. closes [#57](https://github.com/After-the-End-of-All-Things/game/issues/57) ([2b9b497](https://github.com/After-the-End-of-All-Things/game/commit/2b9b497c3e8e009865bf4868b89dcd1954657187))
* **analytics:** add gameanalytics to server. needs further refinement based on GA team. closes [#33](https://github.com/After-the-End-of-All-Things/game/issues/33) ([f787309](https://github.com/After-the-End-of-All-Things/game/commit/f7873097ff7b71bd3bc7e3eca8239ccfc5c83547))
* **api:** add swagger api docs. closes [#56](https://github.com/After-the-End-of-All-Things/game/issues/56) ([8760899](https://github.com/After-the-End-of-All-Things/game/commit/8760899d2a3941eeb462e2b2980feface8598744))
* **assets:** better loading of background/portrait counts ([d4532f7](https://github.com/After-the-End-of-All-Things/game/commit/d4532f7c8900a0683e4c733e70bdbb5b9773e74b))
* **assets:** drastically improve asset load speed by caching spritesheet urls. closes [#10](https://github.com/After-the-End-of-All-Things/game/issues/10) ([45783ee](https://github.com/After-the-End-of-All-Things/game/commit/45783eef27e7c8db1f3376853275fdd4738219f3))
* **assets:** load all qualities of asset, closes [#7](https://github.com/After-the-End-of-All-Things/game/issues/7) ([b539704](https://github.com/After-the-End-of-All-Things/game/commit/b53970417874c8478c86c5de383f257812776911))
* **assets:** properly cache assets and only bust if hash doesn't match ([00e6b77](https://github.com/After-the-End-of-All-Things/game/commit/00e6b77957dc831c3867affe223520b8f8c50184)), closes [#19](https://github.com/After-the-End-of-All-Things/game/issues/19)
* **assets:** properly cache bust/store spritesheets for medium quality ([5c68b84](https://github.com/After-the-End-of-All-Things/game/commit/5c68b84d673014a1b180b528d5fd26f99f51213a))
* **asset:** support actually selecting different qualities of assets. closes [#6](https://github.com/After-the-End-of-All-Things/game/issues/6) ([4b50d8f](https://github.com/After-the-End-of-All-Things/game/commit/4b50d8fc3033bafb1ee4873876b5da9520dc1db4))
* **background:** cache background urls ([6ee80ac](https://github.com/After-the-End-of-All-Things/game/commit/6ee80ac146a45db7dcc0538fe99b72f1344d2b64))
* **collectibles:** add progress to collectibles. closes [#73](https://github.com/After-the-End-of-All-Things/game/issues/73) ([36a4997](https://github.com/After-the-End-of-All-Things/game/commit/36a4997db651007984c8ffaa9380e202f71e32aa))
* **collections:** add collections page for viewing all stuff in the game ([d91848c](https://github.com/After-the-End-of-All-Things/game/commit/d91848c55a83167ea7e567b506fc58d0984d62fb))
* **collections:** add scaffolded collections page ([38ebcf6](https://github.com/After-the-End-of-All-Things/game/commit/38ebcf6f6209c48cf960040a2eb84e1eab08fb4f))
* **collections:** collections now impart rewards. closes [#39](https://github.com/After-the-End-of-All-Things/game/issues/39) ([b097634](https://github.com/After-the-End-of-All-Things/game/commit/b0976349596706cb3a934a084e598f26927c0f5a))
* **collections:** hide collectible information for unfound ones ([4ed7124](https://github.com/After-the-End-of-All-Things/game/commit/4ed7124555028f9ea3dc08204767c798c2017060))
* **collections:** show collectible description ([cc9627a](https://github.com/After-the-End-of-All-Things/game/commit/cc9627a36c4b95218b8ec01423d44264430c365e))
* **core:** add exp xp multiplier variable for faster dev ([2b7d069](https://github.com/After-the-End-of-All-Things/game/commit/2b7d06918d1a22ea529137e09c7139482ad57bd9))
* **core:** add explore speed multiplier to make local testing faster ([4aeabd2](https://github.com/After-the-End-of-All-Things/game/commit/4aeabd28f69a0866346f2eb96444dc68ed37722d))
* **core:** add nestia. closes [#2](https://github.com/After-the-End-of-All-Things/game/issues/2) ([fbb6ca6](https://github.com/After-the-End-of-All-Things/game/commit/fbb6ca6bd92d2a337521d2f740a4ce971fe1b2ae))
* **core:** can now collect resources ([330af1c](https://github.com/After-the-End-of-All-Things/game/commit/330af1c0a424799de9c6a68e9f8a8ce8d236b86f)), closes [#46](https://github.com/After-the-End-of-All-Things/game/issues/46)
* **craft:** add confirm to craft ([fc21e6e](https://github.com/After-the-End-of-All-Things/game/commit/fc21e6e18c89e77a677cca03ee3824daa1220c16))
* **crafting:** add crafting. update some old systems. closes [#46](https://github.com/After-the-End-of-All-Things/game/issues/46) ([953944d](https://github.com/After-the-End-of-All-Things/game/commit/953944d6a56e9f933617bf44e96dcb69e514933f))
* **database:** add indexes to non-fulluser schemas ([0b218b1](https://github.com/After-the-End-of-All-Things/game/commit/0b218b140d8f1d3014ccaf7de2528f2d513d5a3d))
* **equip:** better nothing equipped messaging ([2c8c86e](https://github.com/After-the-End-of-All-Things/game/commit/2c8c86e41fbc1f8a0510a620df0205c0666cbebc))
* **error:** handle errors by myself instead of using a library because I want to send some back to the user too ([78d9d8b](https://github.com/After-the-End-of-All-Things/game/commit/78d9d8b328d2a75f35e0711a2ce2c5705d8d3043))
* **errors:** add rollbar for error tracking. closes [#29](https://github.com/After-the-End-of-All-Things/game/issues/29) ([660703f](https://github.com/After-the-End-of-All-Things/game/commit/660703f6574b009eb890dc7edb7559e9bc876383))
* **explore:** add wave option from explore (based on npcChance). targets a random player at that location. creates a notification that target user can use to wave back to the originating player ([ffcb7b6](https://github.com/After-the-End-of-All-Things/game/commit/ffcb7b6bd9bf1443847ff9c4bafe128a3a950edc))
* **explore:** collectible rarity now matters ([92220bd](https://github.com/After-the-End-of-All-Things/game/commit/92220bd5892ce03ea48bd0c7136b19356d2c73c6))
* **inventory:** add item compare modal pre-equip. closes [#76](https://github.com/After-the-End-of-All-Things/game/issues/76) ([4d0e234](https://github.com/After-the-End-of-All-Things/game/commit/4d0e234d0ca7f098073641dc9bdb89863fc1b686))
* **inventory:** allow multiple collects for collectibles and equipment ([b95bfcf](https://github.com/After-the-End-of-All-Things/game/commit/b95bfcf7d2f2ca262cd9507bc082f4af3e2d5d39))
* **item:** can find items, collectibles, view them in inventory ([99fa6fe](https://github.com/After-the-End-of-All-Things/game/commit/99fa6fecb8be76fbb89fc385f21c6b1c5c130c69))
* **item:** can now equip items, closes [#68](https://github.com/After-the-End-of-All-Things/game/issues/68) ([5ee41b1](https://github.com/After-the-End-of-All-Things/game/commit/5ee41b1b51f76ac4e7279bd5af1eb10628144ecb))
* **item:** can now sell items ([0740d47](https://github.com/After-the-End-of-All-Things/game/commit/0740d4748ad637eec8caf40ad531c474f914bed4))
* **linkage:** add discord join link ([8a7b3e7](https://github.com/After-the-End-of-All-Things/game/commit/8a7b3e7c60a5a2d8ba42b4fbbaefc66e2fbf4bd8))
* **location:** show location stats on travel screen and explore screen ([b5d2b55](https://github.com/After-the-End-of-All-Things/game/commit/b5d2b551094607ebae454f4249bc31d68997241e)), closes [#15](https://github.com/After-the-End-of-All-Things/game/issues/15) [#20](https://github.com/After-the-End-of-All-Things/game/issues/20)
* **logging:** add more logging ([a29bbe4](https://github.com/After-the-End-of-All-Things/game/commit/a29bbe4ca8a6eb2a7c8f3485131b7044345ca8b6))
* **login:** login page will show latest announcement. closes [#30](https://github.com/After-the-End-of-All-Things/game/issues/30) ([470f2dc](https://github.com/After-the-End-of-All-Things/game/commit/470f2dc63dcd32564da91b28adc8e7ab4bea0471))
* **market:** can list items on market, market interface ([a8d7e4f](https://github.com/After-the-End-of-All-Things/game/commit/a8d7e4f73a7f8258504ba647eabeefd0d0c01085))
* **market:** sales history is tracked per sale. closes [#83](https://github.com/After-the-End-of-All-Things/game/issues/83) ([2ed1c46](https://github.com/After-the-End-of-All-Things/game/commit/2ed1c46856cb9a3bd7b5a33b6c928deeb66034bc))
* **me:** add my total stat calculations ([25f8295](https://github.com/After-the-End-of-All-Things/game/commit/25f82955920ad1fe61b0392be74162011f7a4ce8))
* **me:** can now set bio and longbio ([bfc618f](https://github.com/After-the-End-of-All-Things/game/commit/bfc618f94a1ee420c04d0823befda302ba3a3fd2)), closes [#12](https://github.com/After-the-End-of-All-Things/game/issues/12)
* **notification:** add location discovery notification ([b7b2a97](https://github.com/After-the-End-of-All-Things/game/commit/b7b2a97aceb7e962322f853a0d9ea3425fd7bafd))
* **notifications:** add notification system. add levelup notifications that auto dismiss after an hour ([0f26cbe](https://github.com/After-the-End-of-All-Things/game/commit/0f26cbec9622f89edc58468e6a454b0abd7ea137))
* **notification:** support one notification action to travel ([b4ad5b3](https://github.com/After-the-End-of-All-Things/game/commit/b4ad5b31364ca3ab90f85d05ccac81c69555607f))
* **notifications:** use SSE instead of long polling to get new notifications ([c7f4857](https://github.com/After-the-End-of-All-Things/game/commit/c7f4857d8f63941405c46fb8d2265150e417b485))
* **options:** add options page, it does nothing. closes [#37](https://github.com/After-the-End-of-All-Things/game/issues/37) ([0e6915a](https://github.com/After-the-End-of-All-Things/game/commit/0e6915a019f18074f320b46efee4def89ef28a1e))
* **player:** show player stats ([45ea36a](https://github.com/After-the-End-of-All-Things/game/commit/45ea36a0a976bcfd32ce47c2e132fbe6776b86a6))
* **profile:** add censor-sensor to stop people from being unnecessarily profane. closes [#11](https://github.com/After-the-End-of-All-Things/game/issues/11) ([429fbf8](https://github.com/After-the-End-of-All-Things/game/commit/429fbf835855eba99c7348fc0a32bcb8d846f973))
* **profile:** add logout button. closes [#55](https://github.com/After-the-End-of-All-Things/game/issues/55) ([2cf7cae](https://github.com/After-the-End-of-All-Things/game/commit/2cf7caed753c7c2f4ab9e9a8e73053d4cc51f6d9))
* **travel:** show # collectibles found per location, closes [#77](https://github.com/After-the-End-of-All-Things/game/issues/77) ([8112255](https://github.com/After-the-End-of-All-Things/game/commit/81122558caaae152a272117143a898524559a902))
* **ui:** add background-art component to make it easier to update when it happens ([85a52db](https://github.com/After-the-End-of-All-Things/game/commit/85a52dbcac28e14642b3e08ed5371bb3769ad947))
* **ui:** add modals to confirm travel/walk ([b2494c2](https://github.com/After-the-End-of-All-Things/game/commit/b2494c2810c4f7d57dc40dee510bd115f0606331)), closes [#22](https://github.com/After-the-End-of-All-Things/game/issues/22)
* **ui:** add my profile page ([4b2598c](https://github.com/After-the-End-of-All-Things/game/commit/4b2598c3816afa3c3959ba8cad92eabe22664510))
* **ui:** cache background images ([184a82b](https://github.com/After-the-End-of-All-Things/game/commit/184a82b126cff7284f9ee2a77634d734ec9782ac))
* **ui:** can collect items/collectibles. closes [#21](https://github.com/After-the-End-of-All-Things/game/issues/21) ([8fa6fcf](https://github.com/After-the-End-of-All-Things/game/commit/8fa6fcf7e944fc5179de3331f738da8e38f767a3))
* **ui:** server can run arbitrary ui actions ([f0a6074](https://github.com/After-the-End-of-All-Things/game/commit/f0a6074124a9375eee92e8b541dda44ef7820fbe))
* **updates:** add game updates page, closes [#80](https://github.com/After-the-End-of-All-Things/game/issues/80) ([4850a97](https://github.com/After-the-End-of-All-Things/game/commit/4850a973531778e862c14bc4a63bdafba5265b15))
* **updates:** blogpost generator puts version in title ([42e669c](https://github.com/After-the-End-of-All-Things/game/commit/42e669c97389cd6adddb6a9cec94550978331d82))



