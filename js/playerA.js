window.playerA = new (class PlayerControl {
  // A 选手   B 选手
  constructor(type) {
    this.type = type;
    this.#moveEv = new CustomEvent("keydown");
    this.#fireEv = new CustomEvent("keydown");
    this.firetimestamp = (new Date()).valueOf()
    this.priority = this.#DIRECTION.STOP;
  }

  land() {
    this.#setName();
    // 当前的坦克实例
    var cur = undefined
    var enr = undefined
    aMyTankCount.forEach(element => {
      var c = element
      if(c['id'] == 100)
      {
        cur = c
      }
      if(c['id'] == 200)
      {
        enr = c
      }
    });
    const currentTank = cur
    const enemyTank = enr
    if (!currentTank) return;

    //下面是方便读取的全局数据的别名
    // 所有的地方坦克实例数组
    const enemyTanks = aTankCount;
    // 所有的敌方子弹实例数组
    const enemyBullets = aBulletCount;
    // 坦克的宽高
    const currentTankWH = 50;
    // 子弹的宽高
    const bulletWH = 10;
    // 坦克的x,y  ===> 坦克中心点
    const currentTankX = currentTank.X;
    const currentTankY = currentTank.Y;
    const currentTankDirect = currentTank.direction
    //我方子弹
    const myBullets = this.type === "A" ? aMyBulletCount1 : aMyBulletCount2;

    const eBullets = this.type === "A" ? aMyBulletCount2 : aMyBulletCount1;
    // 游戏限制的子弹数为5 = aMyBulletCount2
    const myBulletLimit = 5;

    // 当前策略移动方向
    let moveDirection = undefined



    // 中央逃逸点
    const cx = canvas.width/2;
    const cy = canvas.height/2

    // 躲AI子弹
    let Bullet = new Array(this.#DIRECTION.STOP, this.#DIRECTION.STOP, this.#DIRECTION.STOP, this.#DIRECTION.STOP, this.#DIRECTION.STOP, this.#DIRECTION.STOP, this.#DIRECTION.STOP, this.#DIRECTION.STOP, this.#DIRECTION.STOP, this.#DIRECTION.STOP, this.#DIRECTION.STOP, this.#DIRECTION.STOP, this.#DIRECTION.STOP,);

    this.#calcBulletDistance(enemyBullets, currentTankX, currentTankY, Bullet, currentTankWH, bulletWH)
    this.#calcBulletDistance(eBullets, currentTankX, currentTankY, Bullet, currentTankWH, bulletWH)
    moveDirection = this.#avoidBullet(currentTankX, currentTankY, currentTankWH, Bullet, moveDirection)

    var lateEnemy = undefined
    var misDistanceOfEnemy = currentTankWH * 100
    var secruitydistance = currentTankWH * 6
    var secruitylevel = enemyTanks.length
    var firedirectdis = 4
    var escapedir = 4
    var fight = 6
    var escapenum = 0

    for (const enemy of enemyTanks) {
      const dis = this.#calcTwoPointDistance(
        currentTankX,
        currentTankY,
          enemy.X,
          enemy.Y 
      );

      if(secruitydistance>dis  && enemyTanks.length >= 4)
      {
        escapenum++//逃亡系数，大了就要跑
      }
      if (misDistanceOfEnemy > dis) {
        misDistanceOfEnemy = dis;
        lateEnemy = enemy;
      }
    }
    if(undefined != enemyTank)
    {
      const enemydis = this.#calcTwoPointDistance(
        currentTankX,
        currentTankY,
        enemyTank.X,
        enemyTank.Y 
      );
      if (enemydis<misDistanceOfEnemy)
      {
        lateEnemy = enemyTank;
        firedirectdis = 1
        escapedir = 1
        fight = 3
      }
    }
    if(secruitylevel<=2 && undefined != enemyTank)//是否可以加速打电脑
    {
       firedirectdis = 3
       escapedir = 3
       fight = 4
    }
    if (moveDirection == undefined && escapenum < 4) {
      //不移动可以考虑炮击
      if (undefined != lateEnemy) {
        var disX = Math.abs(lateEnemy.X - currentTankX)
        var disY = Math.abs(lateEnemy.Y - currentTankY)
        var dis = this.#calcTwoPointDistance(currentTankX, currentTankY, lateEnemy.X, lateEnemy.Y)
        if (/*(disX > firedirectdis * currentTankWH || disY > firedirectdis * currentTankWH) ||*/ dis >= firedirectdis * currentTankWH) {//调整炮口
          if ((disX < disY) && (lateEnemy.Y < currentTankY) && this.#DIRECTION.STOP == Bullet[1] && this.#DIRECTION.STOP == Bullet[2] && this.#DIRECTION.STOP == Bullet[3]) {
            if (currentTankDirect != this.#DIRECTION.UP) {
              moveDirection = this.#DIRECTION.UP;
              console.log("炮口调整", moveDirection)
            }
          } else if ((disX < disY) && (lateEnemy.Y >= currentTankY) && this.#DIRECTION.STOP == Bullet[9] && this.#DIRECTION.STOP == Bullet[10] && this.#DIRECTION.STOP == Bullet[11]) {
            if (currentTankDirect != this.#DIRECTION.DOWN) {
              moveDirection = this.#DIRECTION.DOWN;
              console.log("炮口调整", moveDirection)
            }
          } else if ((disX > disY) && (lateEnemy.X >= currentTankX) && this.#DIRECTION.STOP == Bullet[3] && this.#DIRECTION.STOP == Bullet[7] && this.#DIRECTION.STOP == Bullet[11]) {
            if (currentTankDirect != this.#DIRECTION.RIGHT) {
              moveDirection = this.#DIRECTION.RIGHT;
              console.log("炮口调整", moveDirection)
            }
          } else if ((disX > disY) && (lateEnemy.X < currentTankX) && this.#DIRECTION.STOP == Bullet[1] && this.#DIRECTION.STOP == Bullet[4] && this.#DIRECTION.STOP == Bullet[9]) {
            if (currentTankDirect != this.#DIRECTION.LEFT) {
              moveDirection = this.#DIRECTION.LEFT;
              console.log("炮口调整", moveDirection)
            }
          }
        }
        if ((disX > fight * currentTankWH || disY > fight * currentTankWH) && dis > fight * currentTankWH) {//追击
          if ((disX < disY) && (lateEnemy.Y < currentTankY) && this.#DIRECTION.STOP == Bullet[1] && this.#DIRECTION.STOP == Bullet[2] && this.#DIRECTION.STOP == Bullet[3]) {
            moveDirection = this.#DIRECTION.UP;
          } else if ((disX < disY) && (lateEnemy.Y >= currentTankY) && this.#DIRECTION.STOP == Bullet[9] && this.#DIRECTION.STOP == Bullet[10] && this.#DIRECTION.STOP == Bullet[11]) {
            moveDirection = this.#DIRECTION.DOWN;
          } else if ((disX > disY) && (lateEnemy.X >= currentTankX) && this.#DIRECTION.STOP == Bullet[3] && this.#DIRECTION.STOP == Bullet[7] && this.#DIRECTION.STOP == Bullet[11]) {
            moveDirection = this.#DIRECTION.RIGHT;
          } else if ((disX > disY) && (lateEnemy.X < currentTankX) && this.#DIRECTION.STOP == Bullet[1] && this.#DIRECTION.STOP == Bullet[4] && this.#DIRECTION.STOP == Bullet[9]) {
            moveDirection = this.#DIRECTION.LEFT;
          }
          console.log("战术前进", moveDirection)
        }
        else if (/*(disX < escapedir * currentTankWH || disY < escapedir * currentTankWH) ||*/ dis < escapedir * currentTankWH) {//逃跑

          if ((disX < disY) && (lateEnemy.Y < currentTankY) && this.#DIRECTION.STOP == Bullet[9] && this.#DIRECTION.STOP == Bullet[10] && this.#DIRECTION.STOP == Bullet[11]) {
            moveDirection = this.#DIRECTION.DOWN;
          } else if ((disX < disY) && (lateEnemy.Y >= currentTankY) && this.#DIRECTION.STOP == Bullet[1] && this.#DIRECTION.STOP == Bullet[2] && this.#DIRECTION.STOP == Bullet[3]) {
            moveDirection = this.#DIRECTION.UP;
          } else if ((disX > disY) && (lateEnemy.X >= currentTankX) && this.#DIRECTION.STOP == Bullet[1] && this.#DIRECTION.STOP == Bullet[4] && this.#DIRECTION.STOP == Bullet[9]) {
            moveDirection = this.#DIRECTION.LEFT;
          } else if ((disX > disY) && (lateEnemy.X < currentTankX) && this.#DIRECTION.STOP == Bullet[3] && this.#DIRECTION.STOP == Bullet[7] && this.#DIRECTION.STOP == Bullet[11]) {
            moveDirection = this.#DIRECTION.RIGHT
          }
          console.log("战术撤退", moveDirection)
        }
        
        var c = (new Date()).valueOf()
        if (c - this.firetimestamp > 500) {
          this.firetimestamp = c
          this.#fire();
          document.onkeyup(this.#fireEv);
        }
      }
    }
    else if(escapenum>=4){
      if (cy > currentTankY  && this.#DIRECTION.STOP == Bullet[9] && this.#DIRECTION.STOP == Bullet[10] && this.#DIRECTION.STOP == Bullet[11]) {
        moveDirection = this.#DIRECTION.DOWN;
      } else if (cy > currentTankY && this.#DIRECTION.STOP == Bullet[1] && this.#DIRECTION.STOP == Bullet[2] && this.#DIRECTION.STOP == Bullet[3]) {
        moveDirection = this.#DIRECTION.UP;
      } else if (cx < currentTankX && this.#DIRECTION.STOP == Bullet[1] && this.#DIRECTION.STOP == Bullet[4] && this.#DIRECTION.STOP == Bullet[9]) {
        moveDirection = this.#DIRECTION.LEFT;
      } else if (cx > currentTankX && this.#DIRECTION.STOP == Bullet[3] && this.#DIRECTION.STOP == Bullet[7] && this.#DIRECTION.STOP == Bullet[11]) {
        moveDirection = this.#DIRECTION.RIGHT
      }
      console.log("中央逃逸", moveDirection)
    }
    moveDirection = this.#avoidBullet(currentTankX, currentTankY, currentTankWH, Bullet, moveDirection)
    this.#move(moveDirection);
    if (undefined != moveDirection) {
      console.log(moveDirection)
    }
  }

  leave() {
    document.onkeyup(this.#moveEv);
    document.onkeyup(this.#fireEv);
  }
  type;
  // private
  // 方向的别名
  #DIRECTION = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
    STOP: 4,
  };
  // 开火事件
  #fireEv;
  // 移动事件
  #moveEv;


  #calcTwoPointDistance(ax, ay, bx, by) {
    return Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
  }
  #collision(myTankx, myTanky, zonex, zoney, currentTankWHx, currentTankWHy, bulletWHx, bulletWHy) {
    return this.#PlayercheckCollide(myTankx, myTanky, currentTankWHx, currentTankWHy, zonex, zoney, bulletWHx, bulletWHy)
  }
  #PlayercheckCollide(A, B, C, D, E, F, G, H) {
    C += A;//算出矩形1右下角横坐标
    D += B;//算出矩形1右下角纵坐标
    G += E;//算出矩形2右下角横纵标
    H += F;//算出矩形2右下角纵坐标
    if (C <= E || G <= A || D <= F || H <= B) {//两个图形没有相交
      return false
    }
    return true
  }
  #avoidBullet(currentTankX, currentTankY, currentTankWH, Bullet, moveDirection) {
    /*  
        0
      1 2 3
    4 5 6 7 8 
      9 10 11
        12
    */
    if (this.#DIRECTION.DOWN == Bullet[2] || this.#DIRECTION.UP == Bullet[10]) { //必须左右移动
      if (!this.#isNearBoundary(currentTankX, currentTankY, this.#DIRECTION.LEFT, currentTankWH
      ) && this.#DIRECTION.DOWN != Bullet[1] && this.#DIRECTION.UP != Bullet[9] && this.#DIRECTION.RIGHT != Bullet[4] && this.#DIRECTION.STOP == Bullet[5]) {
        console.log("安全躲避移动左")
        moveDirection = this.#DIRECTION.LEFT;
      }
      if (!this.#isNearBoundary(currentTankX, currentTankY, this.#DIRECTION.RIGHT, currentTankWH
      ) && this.#DIRECTION.DOWN != Bullet[3] && this.#DIRECTION.STOP == Bullet[11] && this.#DIRECTION.LEFT != Bullet[10] && this.#DIRECTION.UP != Bullet[7]) {
        if(this.priority == this.#DIRECTION.RIGHT && moveDirection == this.#DIRECTION.LEFT)
        {        
          console.log("安全躲避移动右")
          moveDirection = this.#DIRECTION.RIGHT;
        }
      }
      else { console.log("水平无法躲避") }
    }
    else if ((this.#DIRECTION.DOWN == Bullet[0] || this.#DIRECTION.UP == Bullet[12])) { //考虑左右移动
      if (!this.#isNearBoundary(currentTankX, currentTankY, this.#DIRECTION.LEFT, currentTankWH
      ) && this.#DIRECTION.DOWN != Bullet[1] && this.#DIRECTION.UP != Bullet[9] && this.#DIRECTION.RIGHT != Bullet[4] && this.#DIRECTION.STOP == Bullet[5]) {
        console.log("预防安全躲避移动左")
        moveDirection = this.#DIRECTION.LEFT;
      } else if (!this.#isNearBoundary(currentTankX, currentTankY, this.#DIRECTION.RIGHT, currentTankWH
      ) && this.#DIRECTION.DOWN != Bullet[3] && this.#DIRECTION.STOP == Bullet[11] && this.#DIRECTION.LEFT != Bullet[10] && this.#DIRECTION.UP != Bullet[7]) {
        console.log("预防安全躲避移动右边")
        moveDirection = this.#DIRECTION.RIGHT;
      }
      else { console.log("水平警戒不适合移动") }
    }
    if (this.#DIRECTION.RIGHT == Bullet[5] || this.#DIRECTION.LEFT == Bullet[7]) { //必须垂直移动
      if (!this.#isNearBoundary(currentTankX, currentTankY, this.#DIRECTION.UP, currentTankWH
      ) && this.#DIRECTION.RIGHT != Bullet[1] && this.#DIRECTION.STOP == Bullet[2] && this.#DIRECTION.LEFT != Bullet[3] && this.#DIRECTION.DOWN != Bullet[0]) {
        console.log("安全躲避移动上")
        moveDirection = this.#DIRECTION.UP;
      }
      if (!this.#isNearBoundary(currentTankX, currentTankY, this.#DIRECTION.DOWN, currentTankWH
      ) && this.#DIRECTION.RIGHT != Bullet[9] && this.#DIRECTION.STOP == Bullet[10] && this.#DIRECTION.LEFT != Bullet[11] && this.#DIRECTION.UP != Bullet[12]) {

        if(this.priority == this.#DIRECTION.DOWN && moveDirection == this.#DIRECTION.UP)
        {        
          console.log("安全躲避移动下")
          moveDirection = this.#DIRECTION.DOWN;
        }
      } else { console.log("垂直无法躲避") }
    }
    else if ((this.#DIRECTION.RIGHT == Bullet[4] || this.#DIRECTION.LEFT == Bullet[8])) { //考虑垂直移动
      if (!this.#isNearBoundary(currentTankX, currentTankY, this.#DIRECTION.UP, currentTankWH
      ) && this.#DIRECTION.RIGHT != Bullet[1] && this.#DIRECTION.STOP == Bullet[2] && this.#DIRECTION.LEFT != Bullet[3] && this.#DIRECTION.DOWN != Bullet[0]) {
        console.log("预防安全躲避移动上")
        moveDirection = this.#DIRECTION.UP;
      } else if (!this.#isNearBoundary(currentTankX, currentTankY, this.#DIRECTION.DOWN, currentTankWH
      ) && this.#DIRECTION.LEFT != Bullet[9] && this.#DIRECTION.STOP == Bullet[10] && this.#DIRECTION.LEFT != Bullet[11] && this.#DIRECTION.UP != Bullet[12]) {
        console.log("预防安全躲避移动下")
        moveDirection = this.#DIRECTION.DOWN;
      } else { console.log("垂直警戒不适合移动") }
    }
    this.priority = moveDirection;
    return moveDirection
  }
  /*  
      0
    1 2 3
  4 5 6 7 8 
    9 10 11
      12
  */
  #calcBulletDistance(arraybullet, currentTankX, currentTankY, Bullet, currentTankWH, bulletWH) {
    var dis
    for (const bullet of arraybullet) {
      dis = this.#collision(
        currentTankX + currentTankWH,
        currentTankY,
        bullet.X - bulletWH/2 - 1 , bullet.Y- bulletWH/2 - 1 ,
        currentTankWH, currentTankWH, bulletWH * 1.2, bulletWH * 1.2
      );
      if (true == dis ) {
        Bullet[7] = bullet.direction
      } else if(true==this.#collisionMetal(currentTankX + currentTankWH,currentTankY,currentTankWH))
      {
        Bullet[7] = this.#DIRECTION.LEFT 
      }
      dis = this.#collision(
        currentTankX + 2 * currentTankWH,
        currentTankY,
        bullet.X - bulletWH/2 - 1 , bullet.Y- bulletWH/2 - 1 ,
        currentTankWH, currentTankWH, bulletWH * 1.2, bulletWH * 1.2
      );
      if (true == dis) {
        Bullet[8] = bullet.direction
      }
      dis = this.#collision(
        currentTankX - 2 * currentTankWH,
        currentTankY,
        bullet.X - bulletWH/2 - 1 , bullet.Y- bulletWH/2 - 1 ,
        currentTankWH, currentTankWH, bulletWH * 1.2, bulletWH * 1.2
      );
      if (true == dis) {
        Bullet[4] = bullet.direction
      }
      dis = this.#collision(
        currentTankX - currentTankWH,
        currentTankY,
        bullet.X - bulletWH/2 - 1 , bullet.Y- bulletWH/2 - 1 ,
        currentTankWH, currentTankWH, bulletWH * 1.2, bulletWH * 1.2
      );
      if (true == dis) {
        Bullet[5] = bullet.direction
      }else if(true==this.#collisionMetal(currentTankX - currentTankWH,currentTankY,currentTankWH))
      {
        Bullet[5] = this.#DIRECTION.RIGHT 
      }
      dis = this.#collision(
        currentTankX,
        currentTankY + currentTankWH,
        bullet.X - bulletWH/2 - 1 , bullet.Y- bulletWH/2 - 1 ,
        currentTankWH, currentTankWH, bulletWH * 1.2, bulletWH * 1.2
      );
      if (true == dis) {
        Bullet[10] = bullet.direction
      } else if(true==this.#collisionMetal(currentTankX,currentTankY + currentTankWH,currentTankWH))
      {
        Bullet[10] = this.#DIRECTION.UP 
      }
      dis = this.#collision(
        currentTankX,
        currentTankY + 2 * currentTankWH,
        bullet.X - bulletWH/2 - 1 , bullet.Y- bulletWH/2 - 1 ,
        currentTankWH, currentTankWH, bulletWH * 1.2, bulletWH * 1.2
      );
      if (true == dis) {
        Bullet[12] = bullet.direction
      }
      dis = this.#collision(
        currentTankX,
        currentTankY - 2 * currentTankWH,
        bullet.X - bulletWH/2 - 1 , bullet.Y- bulletWH/2 - 1 ,
        currentTankWH, currentTankWH, bulletWH * 1.2, bulletWH * 1.2
      );
      if (true == dis) {
        Bullet[0] = bullet.direction
      }
      dis = this.#collision(
        currentTankX,
        currentTankY - currentTankWH,
        bullet.X - bulletWH/2 - 1 , bullet.Y- bulletWH/2 - 1 ,
        currentTankWH, currentTankWH, bulletWH * 1.2, bulletWH * 1.2
      );
      if (true == dis) {
        Bullet[2] = bullet.direction
      }else if(true==this.#collisionMetal(currentTankX,currentTankY - currentTankWH,currentTankWH))
      {
        Bullet[2] = this.#DIRECTION.DOWN 
      }
      dis = this.#collision(
        currentTankX - currentTankWH,
        currentTankY - currentTankWH,
        bullet.X - bulletWH/2 - 1 , bullet.Y- bulletWH/2 - 1 ,
        currentTankWH, currentTankWH, bulletWH * 1.2, bulletWH * 1.2
      );
      if (true == dis) {
        Bullet[1] = bullet.direction
      }
      dis = this.#collision(
        currentTankX + currentTankWH,
        currentTankY - currentTankWH,
        bullet.X - bulletWH/2 - 1 , bullet.Y- bulletWH/2 - 1 ,
        currentTankWH, currentTankWH, bulletWH * 1.2, bulletWH * 1.2
      );
      if (true == dis) {
        Bullet[3] = bullet.direction
      }
      dis = this.#collision(
        currentTankX - currentTankWH,
        currentTankY + currentTankWH,
        bullet.X - bulletWH/2 - 1 , bullet.Y- bulletWH/2 - 1 ,
        currentTankWH, currentTankWH, bulletWH * 1.2, bulletWH * 1.2
      );
      if (true == dis) {
        Bullet[9] = bullet.direction
      }
      dis = this.#collision(
        currentTankX + currentTankWH,
        currentTankY + currentTankWH,
        bullet.X - bulletWH/2 - 1 , bullet.Y- bulletWH/2 - 1 ,
        currentTankWH, currentTankWH, bulletWH * 1.2, bulletWH * 1.2
      );
      if (true == dis) {
        Bullet[11] = bullet.direction
      }
      var ctx = canvas.getContext('2d');

    }
  }
  // 根据玩家返回正确的方向keyCode
  #helpDirectionKeyCode(direction) {
    switch (direction) {
      case this.#DIRECTION.UP:
        return this.type === "A" ? 87 : 38;
      case this.#DIRECTION.DOWN:
        return this.type === "A" ? 83 : 40;
      case this.#DIRECTION.LEFT:
        return this.type === "A" ? 65 : 37;
      case this.#DIRECTION.RIGHT:
        return this.type === "A" ? 68 : 39;
    }
  }
  // 设置队伍
  #setName() {
    document.getElementById(
      `Player${this.type === "A" ? 1 : 2}Name`
    ).textContent = `Eward Battle`;
  }
  // 控制移动   举例子：  向左移动： this.#move(this.#DIRECTION.LEFT)
  #move(direction) {
    if (typeof direction === undefined) return;
    this.#moveEv.keyCode = this.#helpDirectionKeyCode(direction);
    document.onkeydown(this.#moveEv);
  }
  // 开火
  #fire(direction) {
    this.#fireEv.keyCode = this.type === "A" ? 32 : 8;
    document.onkeydown(this.#fireEv);
  }
  // TODO： 扫描轨道   预判走位  并给出开火和移动方向
  #scanner(currentTank) { }
  // 判断是否快到边界了
  #isNearBoundary(X = 0, Y = 0, currentDirection = undefined, currentTankWH) {
    if (currentDirection !== undefined) {
      if (
        currentDirection === this.#DIRECTION.DOWN &&
        Y + currentTankWH > screenY
      ) {
        return true;
      } else if (currentDirection === this.#DIRECTION.UP && Y < currentTankWH) {
        return true;
      } else if (currentDirection === this.#DIRECTION.LEFT && X < currentTankWH) {
        return true;
      } else
        return (
          currentDirection === this.#DIRECTION.RIGHT && X + currentTankWH > screenX
        );
    }

    return (
      this.#isNearBoundary(X, Y, this.#DIRECTION.DOWN) ||
      this.#isNearBoundary(X, Y, this.#DIRECTION.UP) ||
      this.#isNearBoundary(X, Y, this.#DIRECTION.RIGHT) ||
      this.#isNearBoundary(X, Y, this.#DIRECTION.LEFT)
    );
  }
  #collisionMetal(x,y,r)
  {
    //障碍阻挡
    const metal = ametal
    if(undefined!=metal)
    {
      for(var i = 0;i<metal.length;i++)
      {
        if(x>metal[i][0] - r && x < metal[i][0] + metal[i][2] && y > metal[i][1]-r && y<metal[i][1] + metal[i][3])
        {
          return true
        }
      }
    }
    return false
  }
})("A");