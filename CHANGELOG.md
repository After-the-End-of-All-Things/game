## [0.1.4](https://github.com/After-The-End-Of-All-Things/game/compare/v0.1.3...v0.1.4) (2023-08-29)


### Bug Fixes

* **combat:** enemies will no longer attempt to move to the wrong side, halting the fight ([957fd3b](https://github.com/After-The-End-Of-All-Things/game/commit/957fd3bcf1452452a27906f09267821b116f2643))
* **fight:** elemental damage is no longer wack. ground targetted spells work ([06b29f3](https://github.com/After-The-End-Of-All-Things/game/commit/06b29f37871eb6ae2f761090cbeb9138e03e15be))
* **fight:** fights can end again ([079e22e](https://github.com/After-The-End-Of-All-Things/game/commit/079e22ea0369f4f757bb3c9ea48f867c1b7b7ba4))
* **fight:** you can no longer kill dead creatures ([fa4e3cd](https://github.com/After-The-End-Of-All-Things/game/commit/fa4e3cd0b89fd96cbef413070fb600328f71c25c))


### Features

* **core:** add logic to service paths, closes [#104](https://github.com/After-The-End-Of-All-Things/game/issues/104) ([c628d71](https://github.com/After-The-End-Of-All-Things/game/commit/c628d712e68c251880c6ea987b469e8d1588a1f1))



## [0.1.3](https://github.com/After-The-End-Of-All-Things/game/compare/v0.1.2...v0.1.3) (2023-08-29)



## [0.1.2](https://github.com/After-The-End-Of-All-Things/game/compare/v0.1.1...v0.1.2) (2023-08-29)


### Bug Fixes

* **build:** generate blog posts correctly ([902326e](https://github.com/After-The-End-Of-All-Things/game/commit/902326e02eadef087c092d4bc156a0e5ad08a4be))



## [0.1.1](https://github.com/After-The-End-Of-All-Things/game/compare/v0.1.0...v0.1.1) (2023-08-29)



# [0.1.0](https://github.com/After-The-End-Of-All-Things/game/compare/0f26cbec9622f89edc58468e6a454b0abd7ea137...v0.1.0) (2023-08-29)


### Bug Fixes

* **action:** wave should have an actual user id ([05a8f7d](https://github.com/After-The-End-Of-All-Things/game/commit/05a8f7d23432d18fba519b9c8d61c296500a3de8))
* **action:** wave should not default to waveback=true ([c187f57](https://github.com/After-The-End-Of-All-Things/game/commit/c187f57bb41617374cd39be82dfc12bbb13b75ba))
* **analytics:** gameanalytics starts a session every time it sends an event now ([bdecd8a](https://github.com/After-The-End-Of-All-Things/game/commit/bdecd8a92ad256978603a8e437d6e89b386e26f7))
* **analytics:** swallow error for sessionStart ([a8c6150](https://github.com/After-The-End-Of-All-Things/game/commit/a8c61500403803ef469c5900302061996a4fbe7c))
* **api:** never trust the client. closes [#70](https://github.com/After-The-End-Of-All-Things/game/issues/70) ([7f4027e](https://github.com/After-The-End-Of-All-Things/game/commit/7f4027e8ed32edc2ee0423a385a9a5828efe1ed8))
* **api:** unite response values of services/controllers to all be the same interface ([aeadbda](https://github.com/After-The-End-Of-All-Things/game/commit/aeadbda27264eee5b8d7146b91b58c961067c33b))
* **auth:** add auth guard to pages, closes [#52](https://github.com/After-The-End-Of-All-Things/game/issues/52) ([2f35dcb](https://github.com/After-The-End-Of-All-Things/game/commit/2f35dcb022e36d772a797872ea36a8e8b10b9da7))
* **avatar:** default avatar shown in modal is no longer +1'd ([d78e40e](https://github.com/After-The-End-Of-All-Things/game/commit/d78e40e880838e7f4c7e565111f1893cd47a019e))
* **client:** fix rollbar sending client error cases ([91c545d](https://github.com/After-The-End-Of-All-Things/game/commit/91c545d2bb551292566b4e8f70acf07d3c10dc56))
* **combat:** combat doesnt end every action ([e083f20](https://github.com/After-The-End-Of-All-Things/game/commit/e083f20c651274904b6c51e2c569e408490adb9d))
* **combat:** fix fight not found errors ([654387a](https://github.com/After-The-End-Of-All-Things/game/commit/654387a07a00b48f7ec637648abc081665a3f660))
* **equipment:** equipment will no longer lose its instance id when equipped ([cb5fa25](https://github.com/After-The-End-Of-All-Things/game/commit/cb5fa2512945f6665f1e405b55b30b5b52e76d40))
* **explore:** explore would display negative xp if you leveled up from it ([96a671a](https://github.com/After-The-End-Of-All-Things/game/commit/96a671a0719bd0716a6c09fbd9e76918daa72817))
* **icon:** fix icon component to fill space correctly ([2071220](https://github.com/After-The-End-Of-All-Things/game/commit/2071220588ebc0fb8c8aff8ca15101373802297b))
* **inventory:** can equip accessories again. closes [#89](https://github.com/After-The-End-Of-All-Things/game/issues/89) ([e12cec5](https://github.com/After-The-End-Of-All-Things/game/commit/e12cec59b1e180e61880eafd63cfd1509ddc1b5d))
* **inventory:** names will wrap if needed ([8e156d9](https://github.com/After-The-End-Of-All-Things/game/commit/8e156d9bb6fce513068f99de38210076bb6f7dd7))
* **login:** get notifications on login. closes [#54](https://github.com/After-The-End-Of-All-Things/game/issues/54) ([2d028e1](https://github.com/After-The-End-Of-All-Things/game/commit/2d028e11948a265d6fb13ef0648287f4bb278d84))
* **login:** no unauthorized error on homepage. closes [#53](https://github.com/After-The-End-Of-All-Things/game/issues/53) ([ee575ce](https://github.com/After-The-End-Of-All-Things/game/commit/ee575cea151f3dc2889a8c6622c92b004cfc82f4))
* **market:** can now list the last of a resource ([1901f37](https://github.com/After-The-End-Of-All-Things/game/commit/1901f37b07460b9a75eac1168f8a6c425f945e87))
* **notifications:** mark all read should not send 1 event per notification ([2c52a6e](https://github.com/After-The-End-Of-All-Things/game/commit/2c52a6efb4a0f6f977b96a4eac994b125c9bcdfd))
* **notifications:** notifications with actions will no longer race to submit data and clear the actions ([6293a4f](https://github.com/After-The-End-Of-All-Things/game/commit/6293a4f49bb8be0407e8aea6660e556ad704b146))
* **portrait:** portrait selection is in the right place again ([2aec357](https://github.com/After-The-End-Of-All-Things/game/commit/2aec3577dcd2c0401212642d9007074cbae86413))
* **profile:** tiny avatar shows again. closes [#63](https://github.com/After-The-End-Of-All-Things/game/issues/63) ([c079201](https://github.com/After-The-End-Of-All-Things/game/commit/c079201e1a6198efd7e7e6d798a3f9e1b7b960b2))
* **setup:** add setup script for client, fix error for server setup ([37733aa](https://github.com/After-The-End-Of-All-Things/game/commit/37733aaff5e94ef43e80999fbd81721c41efa0df))
* **workflow:** only deploy server/client on tags ([6895cc3](https://github.com/After-The-End-Of-All-Things/game/commit/6895cc3ba174f15222f652956d9f1ab61a7308e8))


### Features

* **actions:** better, more robust action handling. closes [#57](https://github.com/After-The-End-Of-All-Things/game/issues/57) ([2b9b497](https://github.com/After-The-End-Of-All-Things/game/commit/2b9b497c3e8e009865bf4868b89dcd1954657187))
* **analytics:** add gameanalytics to server. needs further refinement based on GA team. closes [#33](https://github.com/After-The-End-Of-All-Things/game/issues/33) ([f787309](https://github.com/After-The-End-Of-All-Things/game/commit/f7873097ff7b71bd3bc7e3eca8239ccfc5c83547))
* **api:** add swagger api docs. closes [#56](https://github.com/After-The-End-Of-All-Things/game/issues/56) ([8760899](https://github.com/After-The-End-Of-All-Things/game/commit/8760899d2a3941eeb462e2b2980feface8598744))
* **assets:** better loading of background/portrait counts ([d4532f7](https://github.com/After-The-End-Of-All-Things/game/commit/d4532f7c8900a0683e4c733e70bdbb5b9773e74b))
* **assets:** drastically improve asset load speed by caching spritesheet urls. closes [#10](https://github.com/After-The-End-Of-All-Things/game/issues/10) ([45783ee](https://github.com/After-The-End-Of-All-Things/game/commit/45783eef27e7c8db1f3376853275fdd4738219f3))
* **assets:** load all qualities of asset, closes [#7](https://github.com/After-The-End-Of-All-Things/game/issues/7) ([b539704](https://github.com/After-The-End-Of-All-Things/game/commit/b53970417874c8478c86c5de383f257812776911))
* **assets:** properly cache assets and only bust if hash doesn't match ([00e6b77](https://github.com/After-The-End-Of-All-Things/game/commit/00e6b77957dc831c3867affe223520b8f8c50184)), closes [#19](https://github.com/After-The-End-Of-All-Things/game/issues/19)
* **assets:** properly cache bust/store spritesheets for medium quality ([5c68b84](https://github.com/After-The-End-Of-All-Things/game/commit/5c68b84d673014a1b180b528d5fd26f99f51213a))
* **asset:** support actually selecting different qualities of assets. closes [#6](https://github.com/After-The-End-Of-All-Things/game/issues/6) ([4b50d8f](https://github.com/After-The-End-Of-All-Things/game/commit/4b50d8fc3033bafb1ee4873876b5da9520dc1db4))
* **background:** cache background urls ([6ee80ac](https://github.com/After-The-End-Of-All-Things/game/commit/6ee80ac146a45db7dcc0538fe99b72f1344d2b64))
* **collectibles:** add progress to collectibles. closes [#73](https://github.com/After-The-End-Of-All-Things/game/issues/73) ([36a4997](https://github.com/After-The-End-Of-All-Things/game/commit/36a4997db651007984c8ffaa9380e202f71e32aa))
* **collections:** add collections page for viewing all stuff in the game ([d91848c](https://github.com/After-The-End-Of-All-Things/game/commit/d91848c55a83167ea7e567b506fc58d0984d62fb))
* **collections:** add scaffolded collections page ([38ebcf6](https://github.com/After-The-End-Of-All-Things/game/commit/38ebcf6f6209c48cf960040a2eb84e1eab08fb4f))
* **collections:** collections now impart rewards. closes [#39](https://github.com/After-The-End-Of-All-Things/game/issues/39) ([b097634](https://github.com/After-The-End-Of-All-Things/game/commit/b0976349596706cb3a934a084e598f26927c0f5a))
* **collections:** hide collectible information for unfound ones ([4ed7124](https://github.com/After-The-End-Of-All-Things/game/commit/4ed7124555028f9ea3dc08204767c798c2017060))
* **collections:** show collectible description ([cc9627a](https://github.com/After-The-End-Of-All-Things/game/commit/cc9627a36c4b95218b8ec01423d44264430c365e))
* **core:** add exp xp multiplier variable for faster dev ([2b7d069](https://github.com/After-The-End-Of-All-Things/game/commit/2b7d06918d1a22ea529137e09c7139482ad57bd9))
* **core:** add explore speed multiplier to make local testing faster ([4aeabd2](https://github.com/After-The-End-Of-All-Things/game/commit/4aeabd28f69a0866346f2eb96444dc68ed37722d))
* **core:** add nestia. closes [#2](https://github.com/After-The-End-Of-All-Things/game/issues/2) ([fbb6ca6](https://github.com/After-The-End-Of-All-Things/game/commit/fbb6ca6bd92d2a337521d2f740a4ce971fe1b2ae))
* **core:** can now collect resources ([330af1c](https://github.com/After-The-End-Of-All-Things/game/commit/330af1c0a424799de9c6a68e9f8a8ce8d236b86f)), closes [#46](https://github.com/After-The-End-Of-All-Things/game/issues/46)
* **craft:** add confirm to craft ([fc21e6e](https://github.com/After-The-End-Of-All-Things/game/commit/fc21e6e18c89e77a677cca03ee3824daa1220c16))
* **crafting:** add crafting. update some old systems. closes [#46](https://github.com/After-The-End-Of-All-Things/game/issues/46) ([953944d](https://github.com/After-The-End-Of-All-Things/game/commit/953944d6a56e9f933617bf44e96dcb69e514933f))
* **database:** add indexes to non-fulluser schemas ([0b218b1](https://github.com/After-The-End-Of-All-Things/game/commit/0b218b140d8f1d3014ccaf7de2528f2d513d5a3d))
* **equip:** better nothing equipped messaging ([2c8c86e](https://github.com/After-The-End-Of-All-Things/game/commit/2c8c86e41fbc1f8a0510a620df0205c0666cbebc))
* **error:** handle errors by myself instead of using a library because I want to send some back to the user too ([78d9d8b](https://github.com/After-The-End-Of-All-Things/game/commit/78d9d8b328d2a75f35e0711a2ce2c5705d8d3043))
* **errors:** add rollbar for error tracking. closes [#29](https://github.com/After-The-End-Of-All-Things/game/issues/29) ([660703f](https://github.com/After-The-End-Of-All-Things/game/commit/660703f6574b009eb890dc7edb7559e9bc876383))
* **explore:** add wave option from explore (based on npcChance). targets a random player at that location. creates a notification that target user can use to wave back to the originating player ([ffcb7b6](https://github.com/After-The-End-Of-All-Things/game/commit/ffcb7b6bd9bf1443847ff9c4bafe128a3a950edc))
* **explore:** collectible rarity now matters ([92220bd](https://github.com/After-The-End-Of-All-Things/game/commit/92220bd5892ce03ea48bd0c7136b19356d2c73c6))
* **inventory:** add item compare modal pre-equip. closes [#76](https://github.com/After-The-End-Of-All-Things/game/issues/76) ([4d0e234](https://github.com/After-The-End-Of-All-Things/game/commit/4d0e234d0ca7f098073641dc9bdb89863fc1b686))
* **inventory:** allow multiple collects for collectibles and equipment ([b95bfcf](https://github.com/After-The-End-Of-All-Things/game/commit/b95bfcf7d2f2ca262cd9507bc082f4af3e2d5d39))
* **item:** can find items, collectibles, view them in inventory ([99fa6fe](https://github.com/After-The-End-Of-All-Things/game/commit/99fa6fecb8be76fbb89fc385f21c6b1c5c130c69))
* **item:** can now equip items, closes [#68](https://github.com/After-The-End-Of-All-Things/game/issues/68) ([5ee41b1](https://github.com/After-The-End-Of-All-Things/game/commit/5ee41b1b51f76ac4e7279bd5af1eb10628144ecb))
* **item:** can now sell items ([0740d47](https://github.com/After-The-End-Of-All-Things/game/commit/0740d4748ad637eec8caf40ad531c474f914bed4))
* **linkage:** add discord join link ([8a7b3e7](https://github.com/After-The-End-Of-All-Things/game/commit/8a7b3e7c60a5a2d8ba42b4fbbaefc66e2fbf4bd8))
* **location:** show location stats on travel screen and explore screen ([b5d2b55](https://github.com/After-The-End-Of-All-Things/game/commit/b5d2b551094607ebae454f4249bc31d68997241e)), closes [#15](https://github.com/After-The-End-Of-All-Things/game/issues/15) [#20](https://github.com/After-The-End-Of-All-Things/game/issues/20)
* **logging:** add more logging ([a29bbe4](https://github.com/After-The-End-Of-All-Things/game/commit/a29bbe4ca8a6eb2a7c8f3485131b7044345ca8b6))
* **login:** login page will show latest announcement. closes [#30](https://github.com/After-The-End-Of-All-Things/game/issues/30) ([470f2dc](https://github.com/After-The-End-Of-All-Things/game/commit/470f2dc63dcd32564da91b28adc8e7ab4bea0471))
* **market:** can list items on market, market interface ([a8d7e4f](https://github.com/After-The-End-Of-All-Things/game/commit/a8d7e4f73a7f8258504ba647eabeefd0d0c01085))
* **market:** sales history is tracked per sale. closes [#83](https://github.com/After-The-End-Of-All-Things/game/issues/83) ([2ed1c46](https://github.com/After-The-End-Of-All-Things/game/commit/2ed1c46856cb9a3bd7b5a33b6c928deeb66034bc))
* **me:** add my total stat calculations ([25f8295](https://github.com/After-The-End-Of-All-Things/game/commit/25f82955920ad1fe61b0392be74162011f7a4ce8))
* **me:** can now set bio and longbio ([bfc618f](https://github.com/After-The-End-Of-All-Things/game/commit/bfc618f94a1ee420c04d0823befda302ba3a3fd2)), closes [#12](https://github.com/After-The-End-Of-All-Things/game/issues/12)
* **notification:** add location discovery notification ([b7b2a97](https://github.com/After-The-End-Of-All-Things/game/commit/b7b2a97aceb7e962322f853a0d9ea3425fd7bafd))
* **notifications:** add notification system. add levelup notifications that auto dismiss after an hour ([0f26cbe](https://github.com/After-The-End-Of-All-Things/game/commit/0f26cbec9622f89edc58468e6a454b0abd7ea137))
* **notification:** support one notification action to travel ([b4ad5b3](https://github.com/After-The-End-Of-All-Things/game/commit/b4ad5b31364ca3ab90f85d05ccac81c69555607f))
* **notifications:** use SSE instead of long polling to get new notifications ([c7f4857](https://github.com/After-The-End-Of-All-Things/game/commit/c7f4857d8f63941405c46fb8d2265150e417b485))
* **options:** add options page, it does nothing. closes [#37](https://github.com/After-The-End-Of-All-Things/game/issues/37) ([0e6915a](https://github.com/After-The-End-Of-All-Things/game/commit/0e6915a019f18074f320b46efee4def89ef28a1e))
* **player:** show player stats ([45ea36a](https://github.com/After-The-End-Of-All-Things/game/commit/45ea36a0a976bcfd32ce47c2e132fbe6776b86a6))
* **profile:** add censor-sensor to stop people from being unnecessarily profane. closes [#11](https://github.com/After-The-End-Of-All-Things/game/issues/11) ([429fbf8](https://github.com/After-The-End-Of-All-Things/game/commit/429fbf835855eba99c7348fc0a32bcb8d846f973))
* **profile:** add logout button. closes [#55](https://github.com/After-The-End-Of-All-Things/game/issues/55) ([2cf7cae](https://github.com/After-The-End-Of-All-Things/game/commit/2cf7caed753c7c2f4ab9e9a8e73053d4cc51f6d9))
* **travel:** show # collectibles found per location, closes [#77](https://github.com/After-The-End-Of-All-Things/game/issues/77) ([8112255](https://github.com/After-The-End-Of-All-Things/game/commit/81122558caaae152a272117143a898524559a902))
* **ui:** add background-art component to make it easier to update when it happens ([85a52db](https://github.com/After-The-End-Of-All-Things/game/commit/85a52dbcac28e14642b3e08ed5371bb3769ad947))
* **ui:** add modals to confirm travel/walk ([b2494c2](https://github.com/After-The-End-Of-All-Things/game/commit/b2494c2810c4f7d57dc40dee510bd115f0606331)), closes [#22](https://github.com/After-The-End-Of-All-Things/game/issues/22)
* **ui:** add my profile page ([4b2598c](https://github.com/After-The-End-Of-All-Things/game/commit/4b2598c3816afa3c3959ba8cad92eabe22664510))
* **ui:** cache background images ([184a82b](https://github.com/After-The-End-Of-All-Things/game/commit/184a82b126cff7284f9ee2a77634d734ec9782ac))
* **ui:** can collect items/collectibles. closes [#21](https://github.com/After-The-End-Of-All-Things/game/issues/21) ([8fa6fcf](https://github.com/After-The-End-Of-All-Things/game/commit/8fa6fcf7e944fc5179de3331f738da8e38f767a3))
* **ui:** server can run arbitrary ui actions ([f0a6074](https://github.com/After-The-End-Of-All-Things/game/commit/f0a6074124a9375eee92e8b541dda44ef7820fbe))
* **updates:** add game updates page, closes [#80](https://github.com/After-The-End-Of-All-Things/game/issues/80) ([4850a97](https://github.com/After-The-End-Of-All-Things/game/commit/4850a973531778e862c14bc4a63bdafba5265b15))
* **updates:** blogpost generator puts version in title ([42e669c](https://github.com/After-The-End-Of-All-Things/game/commit/42e669c97389cd6adddb6a9cec94550978331d82))



