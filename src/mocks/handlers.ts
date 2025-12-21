/**
 * MSW 핸들러 모음
 * orval로 생성된 모든 mock 핸들러를 통합
 */

import { getActorsMock } from '../actors/actors.msw';
import { getAgenciesMock } from '../agencies/agencies.msw';
import { getAuthMock } from '../auth/auth.msw';
import { getCharactersMock } from '../characters/characters.msw';
import { getFavoritesMock } from '../favorites/favorites.msw';
import { getFilmographyMock } from '../filmography/filmography.msw';
import { getProjectsMock } from '../projects/projects.msw';
import { getShowreelsMock } from '../showreels/showreels.msw';
import { getUploadMock } from '../upload/upload.msw';
import { getUsersMock } from '../users/users.msw';

export const handlers = [
  ...getActorsMock(),
  ...getAgenciesMock(),
  ...getAuthMock(),
  ...getCharactersMock(),
  ...getFavoritesMock(),
  ...getFilmographyMock(),
  ...getProjectsMock(),
  ...getShowreelsMock(),
  ...getUploadMock(),
  ...getUsersMock(),
];



