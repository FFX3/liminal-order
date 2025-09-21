+----------------------------+
|      Pure JavaScript       |
+----------------------------+
| createEsiEndpointStore()   |
|   - fetchData()            |
|   - localStorage caching   |
|   - transformer function   |
| esiStore (core)            |
|   - setAuth(jwt, char)     |
| initEsi() / restoreEsi()   |
|   - parse JWT              |
|   - extractCharacterInfo() |
|   - persist token          |
+----------------------------+
          ▲
          │
          │ interacts with
          │
+----------------------------+
|       Svelte Layer         |
+----------------------------+
| Writable stores API        |
|   - writable(), get(),     |
|     subscribe()            |
| $store auto-subscription   |
|   - $ordersStore, $esiStore|
| Component subscription     |
|   - let data, loading, error|
|   - unsubscribe()          |
| onMount() lifecycle        |
| Reactive statements ($:)   |
+----------------------------+
          ▲
          │
          │ drives
          │
+----------------------------+
|      Svelte Components      |
+----------------------------+
| <OrdersTable />             |
|   - subscribes to ordersStore|
| <CharacterPortrait />       |
|   - subscribes to portrait store|
+----------------------------+