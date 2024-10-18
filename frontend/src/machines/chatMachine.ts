import { createMachine } from 'xstate';

export const chatMachine = createMachine(
  {
    context: {
      '': ''
    },
    id: 'chatMachine',
    initial: 'closed',
    states: {
      opened: {
        description: 'The channel component is open',
        initial: 'messageView',
        states: {
          channelConfigView: {
            description: 'Update channel type, name and picture',
            on: {
              selectHeader: {
                target: 'channelSettings'
              },
              selectChannel: {
                target: 'channelSettings'
              }
            }
          },
          messageView: {
            description: 'The chat component displays the contact view.',
            on: {
              clickOnNotification: {
                target: 'notificationView'
              },
              clickOnSearch: {
                target: 'searchView'
              },
              selectContact: {
                target: 'conversationView'
              },
              clickOnChannel: {
                target: 'channelSettings'
              }
            }
          },
          notificationView: {
            description: 'The chat component displays the notification view.',
            on: {
              clickOnSearch: {
                target: 'searchView'
              },
              clickOnChannel: {
                target: 'channelView'
              },
              clickOnMessage: {
                target: 'messageView'
              }
            }
          },
          searchView: {
            description: 'The chat component displays the search view.',
            on: {
              clickOnNotification: {
                target: 'notificationView'
              },
              clickOnChannel: {
                target: 'channelView'
              },
              clickOnMessage: {
                target: 'messageView'
              }
            }
          },
          conversationView: {
            on: {
              selectHeader: {
                target: 'messageView'
              }
            }
          },
          channelView: {
            description: 'The chat component displays the contact view.',
            on: {
              clickOnNotification: {
                target: 'notificationView'
              },
              clickOnSearch: {
                target: 'searchView'
              },
              clickOnMessage: {
                target: 'messageView'
              },
              selectChannel: {
                target: 'channelSettings'
              },
              addChannel: {
                target: 'createORJoinChannelView'
              },
              selectHeader: {
                target: 'channelSettings'
              }
            }
          },
          channelSettings: {
            on: {
              clickOnChannel: {
                target: 'channelView'
              },
              clickOnSearch: {
                target: 'searchView'
              },
              clickOnNotification: {
                target: 'notificationView'
              },
              clickOnMessage: {
                target: 'messageView'
              },
              addChannel: {
                target: 'createORJoinChannelView'
              },
              updateChannel: {
                target: 'channelConfigView'
              },
              inviteChannel: {
                target: 'inviteChannelView'
              }
            }
          },
          createORJoinChannelView: {
            on: {
              selectHeader: {
                target: 'channelSettings'
              },
              createChannel: {
                target: 'channelNameView'
              },
              joinChannel: {
                target: 'joinChannelView'
              }
            }
          },
          channelNameView: {
            on: {
              inviteChannel: {
                target: 'inviteChannelView'
              },
              selectHeader: {
                target: 'channelSettings'
              },
              previousAddChannel: {
                target: 'createORJoinChannelView'
              }
            }
          },
          joinChannelView: {
            on: {
              selectHeader: {
                target: 'channelSettings'
              },
              clickOnChannel: {
                target: 'channelView'
              }
            }
          },
          inviteChannelView: {
            on: {
              selectHeader: {
                target: 'channelSettings'
              },
              previousAddChannel: {
                target: 'channelNameView'
              },
              clickOnChannel: {
                target: 'channelView'
              }
            }
          },
          'History State': {
            history: 'shallow',
            type: 'history'
          }
        },
        on: {
          CLOSE: {
            target: 'closed'
          }
        }
      },
      closed: {
        description: 'The channel component is closed',
        on: {
          OPEN: {
            target: '#chatMachine.opened.History State'
          }
        }
      }
    },
    schema: {
      events: {} as
        | { type: 'clickOnNotification' }
        | { type: 'clickOnSearch' }
        | { type: 'selectContact' }
        | { type: 'updateChannel' }
        | { type: 'clickOnChannel' }
        | { type: 'clickOnMessage' }
        | { type: 'selectHeader' }
        | { type: 'selectChannel' }
        | { type: 'addChannel' }
        | { type: 'createChannel' }
        | { type: 'joinChannel' }
        | { type: 'inviteChannel' }
        | { type: 'previousAddChannel' }
        | { type: 'closeAddChannel' }
        | { type: 'CLOSE' }
        | { type: 'OPEN' },
      context: {} as { '': string }
    },
    predictableActionArguments: true,
    preserveActionOrder: true
  },
  {
    actions: {},
    services: {},
    guards: {},
    delays: {}
  }
);
