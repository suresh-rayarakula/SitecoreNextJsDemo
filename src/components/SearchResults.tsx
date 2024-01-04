import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface SearchResultItem {
  id: string;
  name: string;
  image_url: string;
  url: string;
  relevancePercentage: number;
  keywords: string[];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const SearchResults = () => {
  const router = useRouter();
  const [keyword, setKeyword] = useState<string>('');

  useEffect(() => {
    const initialKeyword = router.query['q'];
    if (initialKeyword) {
      setKeyword(initialKeyword as string);
      handleSearch(initialKeyword as string);
    }
  }, [router.query]);

  const [searchResult, setSearchResult] = useState<SearchResultItem[]>([]);

  const handleSearch = async (searchKeyword: string): Promise<void> => {
    try {
      const apiURL = 'https://discover.sitecorecloud.io/discover/v2/<search domain id>';

      const requestBody = {
        context: {
          page: {
            uri: 'search',
          },
		   locale: {
            country: "us",
            language: "en"
        }
        },
        widget: {
          items: [
            {
              entity: 'content',
              rfk_id: 'rfkid_7',
              search: {
                content: {},
                limit: 10, // Retrieve a fixed number of results (adjust as needed)
                offset: 0,
              },
            },
          ],
        },
      };

      const response = await fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.widgets && data.widgets.length > 0) {
          const content = data.widgets[0].content;

          if (content && content.length > 0) {
            const filteredResults = content.filter((item: SearchResultItem) => {
              const nameLower = item.name.toLowerCase();
              const keywordLower = searchKeyword.toLowerCase();
              const keywordWords = keywordLower.split(' ');
              let relevancePercentage = 0;

              for (const word of keywordWords) {
                if (nameLower.includes(word)) {
                  relevancePercentage += (word.length / nameLower.length) * 100;
                }
              }

              item.relevancePercentage = relevancePercentage;
              item.keywords = item.keywords || [];
              keywordWords.forEach((keyword) => {
                if (!item.keywords.includes(keyword)) {
                  item.keywords.push(keyword);
                }
              });

              return relevancePercentage > 0;
            });

            setSearchResult(filteredResults);
          } else {
            setSearchResult([]);
          }
        } else {
          setSearchResult([]);
        }
      } else {
        console.error('Error while searching:', response.statusText);
      }
    } catch (error) {
      console.error('Error while searching:', error);
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/search?q=${keyword}`).then(() => {
            handleSearch(keyword);
          });
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {searchResult.length > 0 && (
        <div>
          <h2>Search Results:</h2>
          <ul>
            {searchResult.map((item: SearchResultItem) => (
              <li key={item.id}>
                Relevance: <span>{item.relevancePercentage.toFixed(2)}%</span>
                <br />
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.name}
                </a>
                {/* {item.keywords.length > 0 && <div>Keywords: {item.keywords.join(', ')}</div>} */}
                {console.log('Keywords:', item.keywords)};
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
