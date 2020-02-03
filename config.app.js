const appConfig = {
  aggregates: [
    {
      name: 'ShoppingList',
      commands: 'common/aggregates/shopping_list.commands.js',
      projection: 'common/aggregates/shopping_list.projection.js'
    },
    {
      name: 'comment',
      commands: 'common/aggregates/comment.commands.js',
      projection: 'common/aggregates/comment.projection.js'
    }
  ],
  readModels: [
    {
      name: 'read-model-name',
      projection: 'common/read-models/read-model-name.projection.js',
      resolvers: 'common/read-models/read-model-name.resolvers.js',
      connectorName: 'default'
    }
  ],
  viewModels: [
    {
      name: 'myViewModel',
      projection: 'common/view-models/my-viewmodel.projection.js',
      serializeState: 'common/view-models/my-viewmodel.serialize_state.js',
      deserializeState:
        'common/view-models/my-viewmodel.deserialize_state.js'
    }
  ]
  /* viewModels: [
    {
      name: 'view-model-name',
      projection: 'common/view-models/view-model-name.projection.js',
      serializeState: 'common/view-models/view-model-name.serialize_state.js',
      deserializeState:
        'common/view-models/view-model-name.deserialize_state.js'
    }
  ] */,
  clientEntries: ['client/index.js']
}

export default appConfig
