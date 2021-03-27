import * as types from './types/types';
import * as stories from './types/stories';

import wordEnd from './helpers/wordEnd';

function prepareData(entities: types.Entity[], { sprintId } : { sprintId: number }) : stories.StoryData {
    
  let entitiesArray = { 
    'Comment':  [] as types.Comment[],
    'Commit':   [] as types.Commit[],
    'Sprint':   [] as types.Sprint[]
  };

  let entitiesMap = { 
    'Summary':  new Map() as Map<types.SummaryId, types.Summary>,
    'User':     new Map() as Map<types.UserId, types.User>
  };

  let currentSprint : types.Sprint | undefined = undefined;
  let lastSprint    : types.Sprint | undefined = undefined;

  let commitsBySprints  : Map<types.SprintId, types.Commit[]> = new Map();
  let commentsBySprints : Map<types.SprintId, types.Comment[]> = new Map();

  // -----=== Grouping data by EntityType ===-----
  entities.map((obj) => {
    switch (obj.type) {
      case "Comment": entitiesArray['Comment'].push(obj);      break;
      case "Commit" : entitiesArray['Commit'].push(obj);       break;
      case "Sprint" : entitiesArray['Sprint'].push(obj);       break;
      case "Summary": entitiesMap['Summary'].set(obj.id, obj); break;
      case "User"   : entitiesMap['User'].set(obj.id, obj);    break;
    } 
  });

  // -----=== Sorting sprints, commits & comments by date ===-----
  entitiesArray['Sprint' ].sort((a, b) => a.startAt   - b.startAt);
  entitiesArray['Commit' ].sort((a, b) => a.timestamp - b.timestamp);
  entitiesArray['Comment'].sort((a, b) => a.createdAt - b.createdAt);

  // -----=== Grouping commits & comments by sprint ===-----
  let commmitIndex  : number = 0;
  let commentIndex  : number = 0;
  
  let sprint  : types.Sprint;
  let commit  : types.Commit  = entitiesArray['Commit'][commmitIndex++];
  let comment : types.Comment = entitiesArray['Comment'][commentIndex++];

  for (let sprint of entitiesArray['Sprint']) {

    // Let's find the current & last sprint as well
    if (sprint.id === sprintId - 1) lastSprint = sprint;
    if (sprint.id === sprintId) currentSprint = sprint;


    if (!commentsBySprints.get(sprint.id)) commentsBySprints.set(sprint.id, []);
    if (!commitsBySprints.get(sprint.id))  commitsBySprints.set(sprint.id,  []);

    while (commit && commit.timestamp < sprint.startAt)
      commit = entitiesArray['Commit'][commmitIndex++];
    
    while (commit && commit.timestamp <= sprint.finishAt) {      
      // @ts-ignore
      commitsBySprints.get(sprint.id).push(commit);
      commit = entitiesArray['Commit'][commmitIndex++];
    }

    while (comment && comment.createdAt < sprint.startAt)
      comment = entitiesArray['Comment'][commentIndex++];
    
    while (comment && comment.createdAt <= sprint.finishAt) {            
      // @ts-ignore
      commentsBySprints.get(sprint.id).push(comment);
      comment = entitiesArray['Comment'][commentIndex++];
    }
  }


   let currentCommits  = currentSprint ? commitsBySprints?.get(currentSprint.id)  || [] : [];
   let currentComments = currentSprint ? commentsBySprints?.get(currentSprint.id) || [] : [];

  // -----=== Summarizing current sprint commits by author ===-----
  const commitsByUserSum : Map<types.UserId, number> = new Map();

  for (const { author } of currentCommits) 
    commitsByUserSum.set(author as types.UserId, (commitsByUserSum.get(author as types.UserId) || 0) + 1);

  // -----=== Grouping current sprint comments by author ===-----
  const commentsByUserSumLikes : Map<types.UserId, number> = new Map();

  for (const { author, likes } of currentComments) 
    commentsByUserSumLikes.set(author as types.UserId, (commentsByUserSumLikes.get(author as types.UserId) || 0) + likes.length);  

  // ---------------------------------------------------------------

  // -----=== CREATING LEADERS DATA ===-----

  const leadersData : stories.LeadersData  = { 
    title: 'Больше всего коммитов', 
    subtitle: currentSprint ? currentSprint.name : '', 
    emoji: '👑',
    users: [...commitsByUserSum]
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .map(([k, v]) => {
      let userOrId : types.User | types.UserId | undefined = entitiesMap['User'].get(k) ;
      let user : any;
      if (typeof userOrId === "number") user = entitiesMap['User'].get(userOrId as types.SummaryId);
      else user = userOrId;
      return { 
        id: k, 
        name: user ? user.name as string : '', 
        avatar: user ? user.avatar as string : '', 
        valueText: String(v)
      } as unknown as stories.User;
    })
  };
  
  // -----=== CREATING VOTE DATA ===-----

  const voteData : stories.VoteData  = { 
    title: 'Самый 🔎 внимательный разработчик', 
    subtitle: currentSprint ? currentSprint.name : '', 
    emoji: '🔎',
    users: [...commentsByUserSumLikes]
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .map(([k, v]) => {
      let userOrId : types.User | types.UserId | undefined = entitiesMap['User'].get(k) ;
      let user : any;
      if (typeof userOrId === "number") user = entitiesMap['User'].get(userOrId as types.SummaryId);
      else user = userOrId;
      
      return { 
        id: k, 
        name: user ? user.name as string : '', 
        avatar: user ? user.avatar as string : '', 
        valueText: `${v} ${wordEnd(v, 'голос', '', 'а', 'ов')}`
      } as unknown as stories.User;
    })
  };
  
  // -----=== CREATING CHART DATA ===-----

  const chartData : stories.ChartData = { 
    title: 'Коммиты', 
    subtitle: currentSprint ? currentSprint.name : '', 
    values: [...commitsBySprints]
    .map(([k, v], i) => {
      let sprint : types.Sprint | undefined = entitiesArray['Sprint'][i];
      return { 
        title: String(k), 
        hint: sprint ? sprint.name : '', 
        value: v.length,
        ...((sprint && sprint.id === sprintId) && { active: true })
      };
    }),
    users: leadersData.users
  };

  // -----=== CREATING DIAGRAM DATA ===-----

  const lastCommits = lastSprint ? commitsBySprints?.get(lastSprint.id)  || [] : [];
  let diffCommits = (currentSprint && lastSprint) ? currentCommits.length - lastCommits.length : 0;

  const diagramData : stories.DiagramData = { 
    title: 'Размер коммитов', 
    subtitle: currentSprint ? currentSprint.name : '', 
    totalText: currentSprint ? `${String(currentCommits.length)} ${wordEnd(currentCommits.length, 'коммит', '', 'а', 'ов')}` : '',
    differenceText: `${diffCommits >= 0 ? '+' : ''}${String(diffCommits)} с прошлого спринта`, 
    categories: (() => {

      const findEdgeIndex = (changes : number) : number => 
          changes > 500 ? changes > 1000 ? 0 : 1 : changes > 100 ? 2 : 3;

      const groupCommitsByChanges = (commits : types.Commit[]) : [number, number, number, number] => {
        let groupedCommits : [number, number, number, number] = [0, 0, 0, 0];
        
        commits.map((commit) => { 
          let summaries = commit.summaries;
          let changes = 0;
          
          summaries.map((obj) => {
            let summary : any;
            if (typeof obj === "number") summary = entitiesMap['Summary'].get(obj as types.SummaryId);
            else summary = obj;
            changes += summary ? summary.added + summary.removed : 0;
          });
          
          groupedCommits[findEdgeIndex(changes as number)] += 1;
        });

        return groupedCommits;
      };

      let currentGroupedCommits = groupCommitsByChanges(currentCommits);
      let lastGroupedCommits = groupCommitsByChanges(lastCommits);

      let text = ["> 1001 строки", "501 — 1000 строк", "101 — 500 строк", "1 — 100 строк"];
      let result = [];
            
      for (let i = 0; i < 4; i++) {

        let curr : number = currentGroupedCommits[i] || 0;
        let last : number = lastGroupedCommits[i] || 0;

        result.push({ 
          title: text[i],
          valueText: `${String(curr)} ${wordEnd(curr, 'коммит', '', 'а', 'ов')}`,
          differenceText: `${curr - last >= 0 ? '+' : ''}${String(curr - last)} ${wordEnd(Math.abs(curr - last), 'коммит', '', 'а', 'ов')}`
        });
      }
      return result;

    })(),
  };

  // -----=== CREATING DIAGRAM DATA ===-----

  const activityData : stories.ActivityData = { 
    title: 'Коммиты', 
    subtitle: currentSprint ? currentSprint.name : '', 
    data: (() => {

      const data : number[][] = [[],[],[],[],[],[],[]];

      for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
          data[day]?.push(0);
        }
      }
      
      currentCommits
      .map((commit, i) => {
      
        let timestamp : types.Timestamp = commit.timestamp;
        let date = new Date(timestamp);
        data[date.getDay()][date.getHours()] += 1;
      })

      return { 
        'sun': data[0], 
        'mon': data[1], 
        'tue': data[2], 
        'wed': data[3], 
        'thu': data[4], 
        'fri': data[5], 
        'sat': data[6] 
      };
    })(),
  };

  // -----=== COMBINING ALL TOGETHER & CREATING SLIDE DATA ===-----
  
  const storyData: stories.StoryData = [
    { alias: 'leaders',  data: leadersData  },
    { alias: 'vote',     data: voteData     },
    { alias: 'chart',    data: chartData    },
    { alias: 'diagram',  data: diagramData  },
    { alias: 'activity', data: activityData }
  ]

  return storyData;

}

module.exports = { prepareData }
