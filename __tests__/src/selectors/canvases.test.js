import manifestFixture001 from '../../fixtures/version-2/001.json';
import manifestFixture019 from '../../fixtures/version-2/019.json';
import minimumRequired from '../../fixtures/version-2/minimumRequired.json';
import minimumRequired3 from '../../fixtures/version-3/minimumRequired.json';

import {
  getVisibleCanvases,
  getNextCanvasGrouping,
  getPreviousCanvasGrouping,
  getCanvas,
  getCanvasLabel,
  selectCanvasAuthService,
  selectNextAuthService,
  selectInfoResponse,
  getVisibleCanvasNonTiledResources,
  selectLogoutAuthService,
  getVisibleCanvasIds,
} from '../../../src/state/selectors/canvases';

describe('getVisibleCanvasIds', () => {
  const state = {
    manifests: {
      x: {
        id: 'x',
        json: manifestFixture019,
      },
    },
    windows: {
      a: {
        id: 'a',
        manifestId: 'x',
        visibleCanvases: [
          'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1',
          'https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1',
        ],
      },
    },
  };

  const noManifestationState = {
    manifests: {
      x: {
        id: 'x',
      },
    },
    windows: {
      a: {
        id: 'a',
        manifestId: 'x',
      },
    },
  };

  it('should return canvas groupings based on the canvas index stored window state', () => {
    const selectedCanvases = getVisibleCanvasIds(state, { windowId: 'a' });

    expect(selectedCanvases.length).toEqual(2);
    expect(selectedCanvases).toEqual([
      'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1',
      'https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1',
    ]);
  });

  it('should return undefined when there is no manifestation to get a canvas from', () => {
    const selectedCanvas = getVisibleCanvasIds(noManifestationState, { windowId: 'a' });

    expect(selectedCanvas).toEqual([]);
  });
});

describe('getVisibleCanvases', () => {
  const state = {
    manifests: {
      x: {
        id: 'x',
        json: manifestFixture019,
      },
    },
    windows: {
      a: {
        id: 'a',
        manifestId: 'x',
        visibleCanvases: [
          'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1',
          'https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1',
        ],
      },
    },
  };

  const noManifestationState = {
    manifests: {
      x: {
        id: 'x',
      },
    },
    windows: {
      a: {
        id: 'a',
        manifestId: 'x',
        visibleCanvases: [
          'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1',
          'https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1',
        ],
      },
    },
  };

  it('should return canvas groupings based on the canvas index stored window state', () => {
    const selectedCanvases = getVisibleCanvases(state, { windowId: 'a' });

    expect(selectedCanvases.length).toEqual(2);
    expect(selectedCanvases.map(canvas => canvas.id)).toEqual([
      'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1',
      'https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1',
    ]);
  });

  it('should return undefined when there is no manifestation to get a canvas from', () => {
    const selectedCanvas = getVisibleCanvases(noManifestationState, { windowId: 'a' });

    expect(selectedCanvas).toEqual([]);
  });
});

describe('getNextCanvasGrouping', () => {
  const state = {
    manifests: {
      x: {
        id: 'x',
        json: manifestFixture019,
      },
    },
    windows: {
      a: {
        canvasId: 'http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json',
        id: 'a',
        manifestId: 'x',
        view: 'book',
      },
      b: {
        canvasId: 'does-not-exist',
        id: 'a',
        manifestId: 'x',
      },
    },
  };

  it('should return the next canvas groupings', () => {
    const selectedCanvases = getNextCanvasGrouping(state, { windowId: 'a' });

    expect(selectedCanvases.map(canvas => canvas.id)).toEqual([
      'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1',
      'https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1',
    ]);
  });

  it('returns undefined if the canvas is not found', () => {
    expect(getNextCanvasGrouping(state, { windowId: 'b' })).toBeUndefined();
  });
});

describe('getPreviousCanvasGrouping', () => {
  const state = {
    manifests: {
      x: {
        id: 'x',
        json: manifestFixture019,
      },
    },
    windows: {
      a: {
        canvasId: 'https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1',
        id: 'a',
        manifestId: 'x',
        view: 'book',
      },
      b: {
        canvasId: 'does-not-exist',
        id: 'a',
        manifestId: 'x',
      },
    },
  };

  it('should return the next canvas groupings', () => {
    const selectedCanvases = getPreviousCanvasGrouping(state, { windowId: 'a' });

    expect(selectedCanvases.map(canvas => canvas.id)).toEqual([
      'http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json',
    ]);
  });

  it('returns undefined if the canvas is not found', () => {
    expect(getPreviousCanvasGrouping(state, { windowId: 'b' })).toBeUndefined();
  });
});

describe('getCanvas', () => {
  it('returns the canvas by id', () => {
    const state = { manifests: { a: { json: manifestFixture001 } } };
    const received = getCanvas(state, {
      canvasId: 'https://iiif.bodleian.ox.ac.uk/iiif/canvas/9cca8fdd-4a61-4429-8ac1-f648764b4d6d.json',
      manifestId: 'a',
    });
    expect(received.id).toBe('https://iiif.bodleian.ox.ac.uk/iiif/canvas/9cca8fdd-4a61-4429-8ac1-f648764b4d6d.json');
  });
});

describe('getCanvasLabel', () => {
  it('should return label of the canvas', () => {
    const state = { manifests: { a: { json: manifestFixture001 } } };
    const received = getCanvasLabel(state, {
      canvasId: 'https://iiif.bodleian.ox.ac.uk/iiif/canvas/9cca8fdd-4a61-4429-8ac1-f648764b4d6d.json',
      manifestId: 'a',
    });
    expect(received).toBe('Whole Page');
  });

  it('should return undefined if the canvas is undefined', () => {
    const state = { manifests: { } };
    expect(getCanvasLabel(state, {
      canvasId: 'https://iiif.bodleian.ox.ac.uk/iiif/canvas/9cca8fdd-4a61-4429-8ac1-f648764b4d6d.json',
      manifestId: 'b',
    })).toBeUndefined();
  });

  it('should return the canvas index as (+1) as string if no label given', () => {
    const manifest = {
      '@context': 'http://iiif.io/api/presentation/2/context.json',
      '@id':
       'http://iiif.io/api/presentation/2.1/example/fixtures/19/manifest.json',
      '@type': 'sc:Manifest',
      sequences: [
        {
          canvases: [
            {
              '@id': 'some-canvas-without-a-label',
            },
          ],
        },
      ],
    };

    const state = { manifests: { a: { json: manifest } } };
    const received = getCanvasLabel(state, {
      canvasId: 'some-canvas-without-a-label',
      manifestId: 'a',
    });
    expect(received).toBe('1');
  });
});

describe('selectNextAuthService', () => {
  const auth = {};
  const resource = {
    service: [
      {
        '@id': 'external',
        profile: 'http://iiif.io/api/auth/1/external',
      },
      {
        '@id': 'kiosk',
        profile: 'http://iiif.io/api/auth/1/kiosk',
      },
      {
        '@id': 'clickthrough',
        profile: 'http://iiif.io/api/auth/1/clickthrough',
      },
      {
        '@id': 'login',
        profile: 'http://iiif.io/api/auth/1/login',
      },
      {
        '@id': 'login2',
        profile: 'http://iiif.io/api/auth/1/login',
      },
    ],
  };

  const noAuthResource = {};

  it('returns external first', () => {
    expect(selectNextAuthService({ auth }, resource).id).toEqual('external');
  });

  it('returns kiosk next', () => {
    auth.external = { isFetching: false, ok: false };
    expect(selectNextAuthService({ auth }, resource).id).toEqual('kiosk');
  });

  it('returns clickthrough next', () => {
    auth.external = { isFetching: false, ok: false };
    auth.kiosk = { isFetching: false, ok: false };
    expect(selectNextAuthService({ auth }, resource).id).toEqual('clickthrough');
  });

  it('returns logins last', () => {
    auth.external = { isFetching: false, ok: false };
    auth.kiosk = { isFetching: false, ok: false };
    auth.clickthrough = { isFetching: false, ok: false };
    expect(selectNextAuthService({ auth }, resource).id).toEqual('login');
    auth.login = { isFetching: false, ok: false };
    expect(selectNextAuthService({ auth }, resource).id).toEqual('login2');
  });

  it('returns null if there are no services', () => {
    expect(selectNextAuthService({ auth }, noAuthResource)).toBeNull();
  });

  it('returns null if a service is currently in-flight', () => {
    auth.external = { isFetching: true };
    expect(selectNextAuthService({ auth }, resource)).toBeNull();
  });
});

describe('selectCanvasAuthService', () => {
  const resource = {
    service: [
      {
        '@id': 'external',
        profile: 'http://iiif.io/api/auth/1/external',
      },
      {
        '@id': 'login',
        profile: 'http://iiif.io/api/auth/1/login',
      },
    ],
  };
  const externalOnly = {
    service: [
      {
        '@id': 'external',
        profile: 'http://iiif.io/api/auth/1/external',
      },
    ],
  };

  const state = {
    auth: {},
    infoResponses: {
      'https://iiif.bodleian.ox.ac.uk/iiif/image/9cca8fdd-4a61-4429-8ac1-f648764b4d6d': {
        json: resource,
      },
      'https://stacks.stanford.edu/image/iiif/hg676jb4964%2F0380_796-44': {
        json: externalOnly,
      },
    },
    manifests: {
      a: {
        json: manifestFixture001,
      },
      b: {
        json: manifestFixture019,
      },
    },
  };

  it('returns undefined if there is no current canvas', () => {
    expect(selectCanvasAuthService({ manifests: {} }, { manifestId: 'a' })).toBeUndefined();
  });

  it('returns the next auth service to try', () => {
    expect(selectCanvasAuthService(state, { canvasId: 'https://iiif.bodleian.ox.ac.uk/iiif/canvas/9cca8fdd-4a61-4429-8ac1-f648764b4d6d.json', manifestId: 'a' }).id).toEqual('external');
  });

  it('returns the service if the next auth service is interactive', () => {
    const auth = { external: { isFetching: false, ok: false } };
    expect(selectCanvasAuthService({ ...state, auth }, { canvasId: 'https://iiif.bodleian.ox.ac.uk/iiif/canvas/9cca8fdd-4a61-4429-8ac1-f648764b4d6d.json', manifestId: 'a' }).id).toEqual('login');
  });

  it('returns the last attempted auth service if all of them have been tried', () => {
    const auth = {
      external: { isFetching: false, ok: false },
      login: { isFetching: false, ok: false },
    };
    expect(selectCanvasAuthService({ ...state, auth }, { canvasId: 'https://iiif.bodleian.ox.ac.uk/iiif/canvas/9cca8fdd-4a61-4429-8ac1-f648764b4d6d.json', manifestId: 'a' }).id).toEqual('login');
    expect(selectCanvasAuthService({ ...state, auth }, { canvasId: 'http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json', manifestId: 'b' }).id).toEqual('external');
    expect(selectCanvasAuthService({ ...state, auth }, { canvasId: 'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1', manifestId: 'b' })).toBeUndefined();
  });
});

describe('selectLogoutAuthService', () => {
  it('returns a logout auth service if one exists', () => {
    const logout = {
      '@id': 'http://foo/logout',
      profile: 'http://iiif.io/api/auth/1/logout',
    };
    const resource = {
      service: [
        {
          '@id': 'login',
          profile: 'http://iiif.io/api/auth/1/login',
          service: [
            logout,
          ],
        },
      ],
    };
    const state = {
      auth: {
        login: {
          ok: true,
        },
      },
      infoResponses: {
        'https://iiif.bodleian.ox.ac.uk/iiif/image/9cca8fdd-4a61-4429-8ac1-f648764b4d6d': {
          json: resource,
        },
      },
      manifests: {
        a: {
          json: manifestFixture001,
        },
      },
    };
    expect(
      selectLogoutAuthService(
        state,
        { canvasId: 'https://iiif.bodleian.ox.ac.uk/iiif/canvas/9cca8fdd-4a61-4429-8ac1-f648764b4d6d.json', manifestId: 'a' },
      ).id,
    )
      .toBe(logout['@id']);
  });
});

describe('selectInfoResponse', () => {
  it('returns in the info response for the first canvas resource', () => {
    const resource = { some: 'resource' };

    const state = {
      auth: {},
      infoResponses: {
        'https://iiif.bodleian.ox.ac.uk/iiif/image/9cca8fdd-4a61-4429-8ac1-f648764b4d6d': {
          json: resource,
        },
      },
      manifests: {
        a: {
          json: manifestFixture001,
        },
      },
    };

    expect(selectInfoResponse(state, { canvasId: 'https://iiif.bodleian.ox.ac.uk/iiif/canvas/9cca8fdd-4a61-4429-8ac1-f648764b4d6d.json', manifestId: 'a' }).json).toBe(resource);
  });

  it('returns nothing if there are no canvas resources', () => {
    const state = {
      auth: {},
      manifests: {
        a: {
          json: {
            '@context': 'http://iiif.io/api/presentation/2/context.json',
            '@id':
             'http://iiif.io/api/presentation/2.1/example/fixtures/19/manifest.json',
            '@type': 'sc:Manifest',
            sequences: [
              {
                canvases: [
                  {
                    '@id': 'some-canvas-without-resources',
                  },
                ],
              },
            ],
          },
        },
      },
    };

    expect(selectInfoResponse(state, { canvasId: 'some-canvas-without-resources', manifestId: 'a' })).toBe(undefined);
  });

  it('returns nothing if there are no canvas services', () => {
    const state = {
      auth: {},
      manifests: {
        a: {
          json: {
            '@context': 'http://iiif.io/api/presentation/2/context.json',
            '@id':
             'http://iiif.io/api/presentation/2.1/example/fixtures/19/manifest.json',
            '@type': 'sc:Manifest',
            sequences: [
              {
                canvases: [
                  {
                    '@id': 'some-canvas-without-services',
                    images: [
                      {
                        resource: {
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    };

    expect(selectInfoResponse(state, { canvasId: 'some-canvas-without-services', manifestId: 'a' })).toBe(undefined);
  });
});

describe('getVisibleCanvasNonTiledResources', () => {
  it('returns canvases resources without services', () => {
    const state = {
      manifests: {
        'http://iiif.io/api/presentation/2.0/example/fixtures/1/manifest.json': {
          id: 'http://iiif.io/api/presentation/2.0/example/fixtures/1/manifest.json',
          json: minimumRequired,
        },
      },
      windows: {
        a: {
          manifestId: 'http://iiif.io/api/presentation/2.0/example/fixtures/1/manifest.json',
          visibleCanvases: [
            'http://iiif.io/api/presentation/2.0/example/fixtures/canvas/1/c1.json',
          ],
        },
      },
    };
    expect(getVisibleCanvasNonTiledResources(
      state, { windowId: 'a' },
    )[0].id).toBe('http://iiif.io/api/presentation/2.0/example/fixtures/resources/page1-full.png');
  });
  it('works for v3 Presentation API', () => {
    const state = {
      manifests: {
        'https://preview.iiif.io/cookbook/master/recipe/0001-mvm-image/manifest.json': {
          id: 'https://preview.iiif.io/cookbook/master/recipe/0001-mvm-image/manifest.json',
          json: minimumRequired3,
        },
      },
      windows: {
        a: {
          manifestId: 'https://preview.iiif.io/cookbook/master/recipe/0001-mvm-image/manifest.json',
          visibleCanvases: [
            'https://preview.iiif.io/cookbook/master/recipe/0001-mvm-image/canvas/p1',
          ],
        },
      },
    };
    expect(getVisibleCanvasNonTiledResources(
      state, { windowId: 'a' },
    )[0].id).toBe('http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png');
  });
});
