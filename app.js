const actionTemplate = {
  action: '',
  value: '',
  text: '',
};

const attackTemplate = {
  ...actionTemplate,
  action: 'attack',
  text: 'attacks and deals',
};

const app = Vue.createApp({
  onCreate() {
    console.log(villains);
  },
  data() {
    return {
      renderKey: 0,
      playerName: '',
      playerHealth: 100,
      villainHealth: 100,
      battleLog: [],
      currentRound: 0,
      specialCooldown: 0,
      healsCounter: 2,
      gameStatus: 'Not Started',
      villainName: getRandomVillain(),
    };
  },
  methods: {
    startGame(type) {
      if (type === 'initial') {
        this.gameStatus = 'Active';
      } else {
        this.gameStatus = 'Active';
        this.playerHealth = 100;
        this.villainHealth = 100;
        this.currentRound = 0;
        this.battleLog = [];
        this.specialCooldown = 0;
        this.healsCounter = 2;
        if (type === 'newVillain') {
          this.villainName = getRandomVillain();
        }
      }
    },
    attackVillain() {
      // Generate damage
      var dmg = randomValue(5, 12);
      // Inflict damage on the villain
      this.villainHealth -= dmg;
      // Add to battleLog
      this.battleLog.unshift({
        ...attackTemplate,
        value: { [this.playerName]: dmg },
      });
      // Counter attack the player
      this.attackPlayer();
    },
    attackPlayer() {
      // Generate damage
      var dmg = randomValue(8, 15);
      // Inflict damage on the player
      this.playerHealth -= dmg;
      // Add to battleLog
      this.battleLog.unshift({ ...attackTemplate, value: { Villain: dmg } });

      // End of round actions
      this.finishRound();
    },
    finishRound() {
      // Add a round
      this.currentRound++;
      // Decrease rounds left on the special attack cooldown
      if (this.specialCooldown > 0) this.specialCooldown--;
    },
    specialAttack() {
      // Generate damage
      var dmg = randomValue(10, 25);
      // Inflict damage on the villain
      this.villainHealth -= dmg;
      // Add to battleLog
      this.battleLog.unshift({
        ...attackTemplate,
        value: { [this.playerName]: dmg },
        text: 'uses special attack and deals',
      });
      // Counter attack the player
      this.attackPlayer();
      // Set special attack cooldown to 3 rounds
      this.specialCooldown = 3;
    },
    healPlayer() {
      // Generate healing value
      var healVal = randomValue(8, 20);
      // Prevent heal above 100
      if (healVal + this.playerHealth > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healVal;
      }
      // Decrease heals counter i.e. how many heals left
      this.healsCounter--;
      // Add to battleLog
      this.battleLog.unshift({
        ...actionTemplate,
        action: 'heal',
        value: { [this.playerName]: healVal },
        text: 'heals himslef by',
      });
      // Counter attack the player
      this.attackPlayer();
    },
    goHome() {
      location.reload();
    },
  },
  watch: {
    currentRound() {
      if (
        this.villainHealth > this.playerHealth &&
        this.villainHealth > 0 &&
        this.playerHealth <= 0
      ) {
        this.playerHealth = 0;
        this.gameStatus = 'Game Over';
      } else if (this.villainHealth <= 0 && this.playerHealth <= 0) {
        this.playerHealth = 0;
        this.villainHealth = 0;
        this.gameStatus = 'Draw';
      } else if (this.villainHealth <= 0) {
        this.villainHealth = 0;
        this.gameStatus = 'Game Won';
      }
    },
  },
});

app.mount('#game');
