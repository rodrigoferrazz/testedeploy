const storageService = require('../services/storageService');
const supabase = require('../config/supabase');

// mocking supabase
jest.mock('../config/supabase');

describe('storageService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('generateSignedUrl should return signed URL when successful', async () => {
    // arrange: here, the background for the test is being built.
    const fakeUrl = 'https://signed.url/foto.jpg';
    supabase.storage = {
      from: jest.fn().mockReturnThis(),
      createSignedUrl: jest.fn().mockResolvedValue({
        data: { signedUrl: fakeUrl },
        error: null
      })
    };

    // act: this is where the code actively runs the test
    const result = await storageService.generateSignedUrl('foto.jpg');

    // assert: here, the test results can be visualized.
    expect(supabase.storage.from).toHaveBeenCalledWith('images');
    expect(supabase.storage.createSignedUrl).toHaveBeenCalledWith('foto.jpg', 3600);
    expect(result).toBe(fakeUrl);
  });

  test('generateSignedUrl should return null and log error if supabase returns error', async () => {
    // arrange: here, the background for the test is being built.
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    supabase.storage = {
      from: jest.fn().mockReturnThis(),
      createSignedUrl: jest.fn().mockResolvedValue({
        data: null,
        error: 'some error'
      })
    };

    // act: this is where the code actively runs the test
    const result = await storageService.generateSignedUrl('foto.jpg');

    // assert: here, the test results can be visualized.
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Error generating signed URL:', 'some error');

    consoleSpy.mockRestore();
  });
});